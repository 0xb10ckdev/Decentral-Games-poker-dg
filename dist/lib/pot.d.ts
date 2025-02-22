import { SeatIndex } from 'types/seat-index';
import { Chips } from 'types/chips';
import { SeatArray } from 'types/seat-array';
export default class Pot {
    private _eligiblePlayers;
    private _size;
    private _numberPlayersWithNonZeroBet;
    size(): Chips;
    eligiblePlayers(): SeatIndex[];
    removePlayer(player: SeatIndex): void;
    add(amount: Chips): void;
    collectBetsFrom(players: SeatArray): Chips;
    totalNumberOfBets(): number;
}
