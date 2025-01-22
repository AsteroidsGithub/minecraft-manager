// Handle common errors found in interactions

export default class NoChannelError extends Error {
    constructor() {
        super('No channel found')
        this.name = 'NoChannelError'
        this.message = 'No channel found'
    }
}

export class NoGuildError extends Error {
    constructor() {
        super('No guild found')
        this.name = 'NoGuildError'
        this.message = 'No guild found'
    }
}

export class NoUserError extends Error {
    constructor() {
        super('No user found')
        this.name = 'NoUserError'
        this.message = 'No user found'
    }
}

export class NoInteractionError extends Error {
    constructor() {
        super('No interaction found')
        this.name = 'NoInteractionError'
        this.message = 'No interaction found'
    }
}

export class BadArgumentError extends Error {
    constructor() {
        super('No options found')
        this.name = 'NoOptionsError'
        this.message = 'No options found'
    }
}
