import BaseCommand from '../../../src/core/command';

export default class extends BaseCommand {
    static commandName = 'alpha';
    static description = 'Bestandsnaam laatst, commandName eerst';

    run(): Promise<void> {
        return Promise.resolve();
    }
}
