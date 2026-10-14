import BaseCommand from '../core/command';

// Define arguments
// Define parameters/options

export default class TestCommand extends BaseCommand {
    static commandName = 'test:test';
    static description = 'Test test';

    async run() {
        console.log('hello world from TestCommand');
    }
}
