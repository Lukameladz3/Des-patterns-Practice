import { Command } from './Command';

/**
 * Command Executor (Invoker)
 * 
 * Purpose: Manages and executes commands. Supports command queuing,
 * batch execution, and command history for potential undo operations.
 * 
 * This class demonstrates the full power of the Command pattern by
 * providing centralized command management.
 */
export class CommandExecutor {
    private commandQueue: Command[] = [];
    private executedCommands: Command[] = [];

    /**
     * Adds a command to the execution queue.
     */
    public addCommand(command: Command): CommandExecutor {
        this.commandQueue.push(command);
        return this; // Enables method chaining
    }

    /**
     * Adds multiple commands to the execution queue.
     */
    public addCommands(commands: Command[]): CommandExecutor {
        this.commandQueue.push(...commands);
        return this;
    }

    /**
     * Executes a single command immediately.
     */
    public async executeCommand(command: Command): Promise<void> {
        await command.execute();
        this.executedCommands.push(command);
    }

    /**
     * Executes all queued commands in sequence.
     */
    public async executeAll(): Promise<void> {

        while (this.commandQueue.length > 0) {
            const command = this.commandQueue.shift()!;
            await this.executeCommand(command);
        }

    }

    /**
     * Undoes the last executed command (if supported).
     */
    public async undoLast(): Promise<void> {
        const lastCommand = this.executedCommands.pop();

        if (!lastCommand) {
            return;
        }

        if (lastCommand.undo) {
            await lastCommand.undo();
        } 
    }

    /**
     * Gets the command history.
     */
    public getHistory(): Command[] {
        return [...this.executedCommands];
    }

    /**
     * Clears the command queue and history.
     */
    public clear(): void {
        this.commandQueue = [];
        this.executedCommands = [];
    }

    /**
     * Gets the number of queued commands.
     */
    public getQueueSize(): number {
        return this.commandQueue.length;
    }

    /**
     * Prints the command history.
     */
    public printHistory(): void {
        this.executedCommands.forEach((cmd, index) => {
        });
    }
}

/**
 * Example usage:
 * 
 * const executor = new CommandExecutor();
 * 
 * // Queue multiple commands
 * executor
 *   .addCommand(new NavigateCommand(page, 'https://example.com'))
 *   .addCommand(new ClickCommand(page, '#login-button'))
 *   .addCommand(new TypeCommand(page, '#username', 'testuser'))
 *   .addCommand(new TypeCommand(page, '#password', 'password123'))
 *   .addCommand(new ClickCommand(page, '#submit'));
 * 
 * // Execute all commands
 * await executor.executeAll();
 * 
 * // View history
 * executor.printHistory();
 * 
 * // Undo last command
 * await executor.undoLast();
 */
