import { Command } from 'commander';
import { CommandClass } from './command';

export default class Kernel {
    private program: Command;

    constructor(commands: Map<string, CommandClass>) {
        this.program = new Command();
        this.program.exitOverride();
        this.program.name('QR code generator');

        for (const [commandName, commandClass] of commands) {
            const { description, args } = commandClass;

            const subCommand = this.program
                .command(commandName)
                .description(description)
                .action(async () => {
                    const instance = new commandClass();

                    // Zet elk argument als property op de instance,
                    // zodat run() het kan lezen als this.<naam>.
                    const values: unknown[] = subCommand.processedArgs;
                    (args ?? []).forEach((arg, i) => {
                        Object.assign(instance, { [arg.name]: values[i] });
                    });

                    await instance.run();
                });

            if (args && args.length > 0) {
                for (const arg of args) {
                    subCommand.argument(`<${arg.name}>`, arg.description);
                }
            }
        }
    }

    async handle(argv: string[]) {
        await this.program.parseAsync(argv);
    }
}
