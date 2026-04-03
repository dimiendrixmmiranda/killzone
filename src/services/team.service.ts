// src/services/teams.service.ts

import { teams } from "../data/teams/teams.data"
import { Time, TIME_DESCONHECIDO } from "../domain/Time"

export function getAllTeams(): Time[] {
    return teams
}

export function getTeamById(teamId: string): Time | undefined{
    return teams.find(team => team.id === teamId)
}

export function getTeamsByGame(jogoId: string): Time[] {
    return teams.filter(team => team.jogoId === jogoId)
}

export function getTeamsByRegion(regiao: string): Time[] {
    return teams.filter(team => team.regiao === regiao)
}

export function getTeamSafe(teamId?: string | null) {
  if (!teamId) return TIME_DESCONHECIDO

  const team = getTeamById(teamId)

  return team ?? TIME_DESCONHECIDO
}