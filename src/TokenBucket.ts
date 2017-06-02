import { RateLimitOptions } from './RateLimitOptions';
export class TokenBucket {
    /** The income per interval in milliseconds. */
    private income: number;

    /** The maximum amount of money we can save up. */
    private bucketSize: number;

    /** The interval of the paydays */
    private interval: number;

    /** The current amount of money on the bank. */
    private money: number = 0;

    /** The Date of the last payday. */
    private lastPayed: Date = new Date();

    constructor(rateLimits: RateLimitOptions) {
        this.income = rateLimits.tokensPerInterval;
        this.bucketSize = rateLimits.bucketSize;
        this.interval = rateLimits.interval;
    }

    private get hourlyWage() {
        return this.income / this.interval;
    }

    private earn() {
        if (!this.income) {
            this.money = this.bucketSize;
            return;
        }

        let now = new Date();
        let workTime = now.getTime() - this.lastPayed.getTime();
        let salary = (this.hourlyWage / this.interval) * workTime;

        this.money = Math.min(this.money + salary, this.bucketSize);
        this.lastPayed = now;
    }

    pay(fee: number): boolean {
        if (!this.bucketSize) {
            return true;
        }

        if (fee > this.bucketSize) {
            throw new Error('cant never throttle this tho!');
        }

        // Payday!
        this.earn();

        if (this.money < fee) {
            return false;
        }

        this.money -= fee;
        return true;
    }

    get tokens() {
        return this.money;
    }

    clear() {
        this.money = 0;
        this.lastPayed = new Date();
    }
}