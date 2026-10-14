import BaseCommand from '../../../src/core/command';

export default class extends BaseCommand {
    static commandName = 'bye';
    static description = 'Zegt doei';

    run(): Promise<void> {
        return Promise.resolve();
    }
}
