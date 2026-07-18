export interface QuestDef {
  key: string;
  type: 'daily' | 'weekly' | 'boss';
  title: string;
  description: string;
  xpReward: number;
  targetValue: number;
}

export const DAILY_QUESTS: QuestDef[] = [
  {
    key: 'fuel_up',
    type: 'daily',
    title: 'Fuel Up',
    description: 'Hit protein target today',
    xpReward: 60,
    targetValue: 1,
  },
  {
    key: 'feed_the_beast',
    type: 'daily',
    title: 'Feed the Beast',
    description: 'Log at least one meal today',
    xpReward: 20,
    targetValue: 1,
  },
  {
    key: 'on_target',
    type: 'daily',
    title: 'On Target',
    description: 'Hit calorie target today',
    xpReward: 40,
    targetValue: 1,
  },
];

export const WEEKLY_QUESTS: QuestDef[] = [
  {
    key: 'warrior_week',
    type: 'weekly',
    title: 'Warrior Week',
    description: 'Log gym 4 times this week',
    xpReward: 300,
    targetValue: 4,
  },
  {
    key: 'protein_protocol',
    type: 'weekly',
    title: 'Protein Protocol',
    description: 'Hit protein 5 of 7 days',
    xpReward: 250,
    targetValue: 5,
  },
  {
    key: 'weigh_in',
    type: 'weekly',
    title: 'Weigh In',
    description: 'Log weight 3 times',
    xpReward: 150,
    targetValue: 3,
  },
];

export const BOSS_QUESTS: QuestDef[] = [
  {
    key: 'the_logged',
    type: 'boss',
    title: 'The Logged',
    description: '30 consecutive active days',
    xpReward: 2000,
    targetValue: 30,
  },
  {
    key: 'shrink_the_core',
    type: 'boss',
    title: 'Shrink the Core',
    description: 'Lose 2cm off waist',
    xpReward: 500,
    targetValue: 2,
  },
  {
    key: 'macro_monk',
    type: 'boss',
    title: 'Macro Monk',
    description: 'Hit protein 20 of 30 days',
    xpReward: 800,
    targetValue: 20,
  },
];

export const ALL_QUESTS = [...DAILY_QUESTS, ...WEEKLY_QUESTS, ...BOSS_QUESTS];
