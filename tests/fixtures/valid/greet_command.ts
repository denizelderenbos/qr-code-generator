import BaseCommand from '../../../src/core/command';

export default class extends BaseCommand {
    static commandName = 'greet';
    static description = 'Zegt hallo';

    run(): Promise<void> {
        return Promise.resolve();
    }
}
