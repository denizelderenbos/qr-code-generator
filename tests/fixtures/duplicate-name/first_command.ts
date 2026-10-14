import BaseCommand from '../../../src/core/command';

export default class extends BaseCommand {
    static commandName = 'same';
    static description = 'Eerste';

    run(): Promise<void> {
        return Promise.resolve();
    }
}
