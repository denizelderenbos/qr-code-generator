import BaseCommand from '../../../src/core/command';

// De `default` ontbreekt bewust.
export class BrokenCommand extends BaseCommand {
    static commandName = 'broken';
    static description = 'Mist een default export';

    run(): Promise<void> {
        return Promise.resolve();
    }
}
