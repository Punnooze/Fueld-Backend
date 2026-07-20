import { Injectable } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// ponytail: tools call the app's own HTTP endpoints over localhost so all
// existing controller/validation/XP/quest logic is reused — zero coupling to
// FoodsModule/LogsModule internals.
const BASE = `http://127.0.0.1:${process.env.PORT ?? 3001}`;

async function api(method: string, path: string, body?: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`${res.status} ${text}`);
  return data;
}

// ponytail: UTC today. Server on render is UTC; near midnight the app's local
// "today" may differ — pass explicit date to override.
const today = () => new Date().toISOString().split('T')[0];

const ok = (data: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(data) }],
});

// Returned when a destructive/edit tool is called without confirm=true. Claude
// must relay this to the user and only re-call after they agree.
const needsConfirm = (action: string) =>
  ok({
    confirmationRequired: true,
    message: `Ask the user to confirm they want to ${action}, then call again with confirm=true.`,
  });

@Injectable()
export class McpService {
  createServer(): McpServer {
    const server = new McpServer({ name: 'fueld', version: '1.0.0' });

    server.tool(
      'list_foods',
      'List all saved food items (id, name, and per-serving macros). Use to find an existing food before logging.',
      {},
      async () => ok(await api('GET', '/foods')),
    );

    server.tool(
      'add_food',
      'Create a new saved food item. Macros are per one serving; when logging, quantity multiplies them (define macros per 100g and set quantity = grams/100). Returns the created food with its _id.',
      {
        name: z.string(),
        calories: z.number().min(0),
        protein: z.number().min(0),
        carbs: z.number().min(0),
        fat: z.number().min(0),
      },
      async (a) => ok(await api('POST', '/foods', a)),
    );

    server.tool(
      'log_food',
      'Log an existing food to a day. quantity multiplies the food\'s stored macros. date is YYYY-MM-DD (defaults to today). meal is breakfast|lunch|dinner|other.',
      {
        foodItemId: z.string(),
        quantity: z.number().min(0.1),
        date: z.string().optional(),
        meal: z.enum(['breakfast', 'lunch', 'dinner', 'other']).optional(),
        note: z.string().optional(),
      },
      async (a) =>
        ok(await api('POST', '/logs', { ...a, date: a.date ?? today() })),
    );

    server.tool(
      'add_and_log_food',
      'Create a new food AND log it in one step. Use for a brand-new item. Macros are per serving; quantity multiplies them. date defaults to today; meal is breakfast|lunch|dinner|other.',
      {
        name: z.string(),
        calories: z.number().min(0),
        protein: z.number().min(0),
        carbs: z.number().min(0),
        fat: z.number().min(0),
        quantity: z.number().min(0.1),
        date: z.string().optional(),
        meal: z.enum(['breakfast', 'lunch', 'dinner', 'other']).optional(),
        note: z.string().optional(),
      },
      async (a) => {
        const food = await api('POST', '/foods', {
          name: a.name,
          calories: a.calories,
          protein: a.protein,
          carbs: a.carbs,
          fat: a.fat,
        });
        const log = await api('POST', '/logs', {
          foodItemId: food._id,
          quantity: a.quantity,
          date: a.date ?? today(),
          meal: a.meal,
          note: a.note,
        });
        return ok({ food, log });
      },
    );

    server.tool(
      'get_day',
      'Get all food logged on a given day (YYYY-MM-DD, defaults to today) with computed macro totals.',
      { date: z.string().optional() },
      async (a) => {
        const date = a.date ?? today();
        const entries: any[] = await api('GET', `/logs?date=${date}`);
        const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        for (const e of entries) {
          const f = e.foodItemId;
          if (f && typeof f === 'object') {
            totals.calories += (f.calories ?? 0) * e.quantity;
            totals.protein += (f.protein ?? 0) * e.quantity;
            totals.carbs += (f.carbs ?? 0) * e.quantity;
            totals.fat += (f.fat ?? 0) * e.quantity;
          }
        }
        return ok({ date, totals, entries });
      },
    );

    server.tool(
      'update_food',
      'Edit a saved food item\'s name and/or macros. Only call after the user explicitly says to update; pass confirm=true then. Provide only the fields being changed (macros are per serving).',
      {
        id: z.string(),
        name: z.string().optional(),
        calories: z.number().min(0).optional(),
        protein: z.number().min(0).optional(),
        carbs: z.number().min(0).optional(),
        fat: z.number().min(0).optional(),
        confirm: z.boolean().optional(),
      },
      async ({ id, confirm, ...fields }) => {
        if (!confirm) return needsConfirm(`update the food "${id}"`);
        return ok(await api('PUT', `/foods/${id}`, fields));
      },
    );

    server.tool(
      'update_log',
      'Edit a logged meal entry (quantity, meal, note, date, or swap the food via foodItemId). Only call after the user explicitly says to update; pass confirm=true then. Provide only the fields being changed. Get the entry id from get_day.',
      {
        id: z.string(),
        foodItemId: z.string().optional(),
        quantity: z.number().min(0.1).optional(),
        date: z.string().optional(),
        meal: z.enum(['breakfast', 'lunch', 'dinner', 'other']).optional(),
        note: z.string().optional(),
        confirm: z.boolean().optional(),
      },
      async ({ id, confirm, ...fields }) => {
        if (!confirm) return needsConfirm(`update the log entry "${id}"`);
        return ok(await api('PUT', `/logs/${id}`, fields));
      },
    );

    server.tool(
      'delete_food',
      'Delete a saved food item. Destructive — always ask the user to confirm first, then call with confirm=true.',
      { id: z.string(), confirm: z.boolean().optional() },
      async ({ id, confirm }) => {
        if (!confirm) return needsConfirm(`delete the food "${id}"`);
        return ok(await api('DELETE', `/foods/${id}`));
      },
    );

    server.tool(
      'delete_log',
      'Delete a logged meal entry. Destructive — always ask the user to confirm first, then call with confirm=true. Get the entry id from get_day.',
      { id: z.string(), confirm: z.boolean().optional() },
      async ({ id, confirm }) => {
        if (!confirm) return needsConfirm(`delete the log entry "${id}"`);
        return ok(await api('DELETE', `/logs/${id}`));
      },
    );

    return server;
  }
}
