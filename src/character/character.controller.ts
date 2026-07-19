import { Controller, Get } from '@nestjs/common';
import { CharacterService } from './character.service';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  getCharacter() {
    return this.characterService.getCharacter();
  }

  @Get('records')
  records() {
    return this.characterService.records();
  }
}
