import Pot from './pot';
import { Chips } from 'types/chips';
import { SeatArray } from 'types/seat-array';

export default class PotManager {
  private readonly _pots: Pot[];
  private _aggregateFoldedBets: Chips = 0;

  constructor() {
    this._pots = [new Pot()];
  }

  pots(): Pot[] {
    return this._pots;
  }

  betFolded(amount): void {
    this._aggregateFoldedBets += amount;
  }

  removePlayerFromPots(player: number): void {
    this._pots.forEach((pot: Pot) => pot.removePlayer(player));
  }

  collectBetsFrom(players: SeatArray): void {
    // TODO: Return a list of transactions.
    for (;;) {
      const isPlayerAllIn = players.some(
        (player) =>
          player !== null &&
          player.totalChips() === player.betSize() &&
          player.totalChips() !== 0
      );

      const minBet = this._pots[this._pots.length - 1].collectBetsFrom(players);

      // Calculate the right amount of folded bets to add to the pot.
      // Logic: If 'x' is chips which a player committed to the pot and 'n' is number of (eligible) players in that pot,
      // a player can win exactly x*n chips (from that particular pot).
      const numberOfEligiblePlayers =
        this._pots[this._pots.length - 1].eligiblePlayers().length;
      const aggregateFoldedBetsConsumedAmount = Math.min(
        this._aggregateFoldedBets,
        numberOfEligiblePlayers * minBet
      );
      this._pots[this._pots.length - 1].add(aggregateFoldedBetsConsumedAmount);
      this._aggregateFoldedBets -= aggregateFoldedBetsConsumedAmount;

      if (
        players.filter((player) => player !== null && player.betSize() !== 0)
          .length ||
        isPlayerAllIn
      ) {
        this._pots.push(new Pot());
        continue;
      } else if (this._aggregateFoldedBets !== 0) {
        this._pots[this._pots.length - 1].add(this._aggregateFoldedBets);
        this._aggregateFoldedBets = 0;
      }

      break;
    }
  }
}
