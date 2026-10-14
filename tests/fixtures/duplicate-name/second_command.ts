import BaseCommand from '../../../src/core/command';

export default class extends BaseCommand {
    static commandName = 'same';
    static description = 'Tweede';

    run(): Promise<void> {
        return Promise.resolve();
    }
}
