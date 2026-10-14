import BaseCommand from '../../../src/core/command';

export default class extends BaseCommand {
    static commandName = 'zeta';
    static description = 'Bestandsnaam eerst, commandName laatst';

    run(): Promise<void> {
        return Promise.resolve();
    }
}
