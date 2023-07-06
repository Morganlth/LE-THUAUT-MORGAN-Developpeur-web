// #APP-MANAGER

class AppManager
{
    // --VARIABLES
    keyWords = ['log', 'clear', 'reset', 'success', 'error', 'getFps', 'effect', 'eco']
    storageKeys = ['effect']

    cmd = null

    freeze

    // --CONSTRUCTOR
    constructor() { this.freeze = writable(false) }

    // --RESET
    reset(view)
    {
        for (const key of this.storageKeys) this[key]('d')

        if (!view) this.clear()
    }

    // --MANAGEMENT
    log(msg)
    {
        const type = msg instanceof Error ? msg instanceof AppSuccess ? 'success' : 'error' : null

        this.cmd.lastChild.insertAdjacentHTML('beforebegin', `
            <div class="line">
                <div class="line-indicator"></div>
                <div class="line-content">
                    ${type ? `
                    <span class="console-${type}">${msg.name}:</span>
                    <pre class="console-result">${msg.message.trim()}</pre>` : `
                    <pre class="console-result">${msg.trim()}</pre>`}
                </div>
            </div>
        `)
    }

    success(msg) { this.log(new AppSuccess(msg)) }
    
    error(msg, type) { throw new AppError(type ?? 'Error', msg) }

    // --TEST
    testDefault(value) { return value === 'd' || value === 'default' }

    testNumber(value, min, max)
    {
        if (!/^\d*?\.?\d+$/.test(value)) this.error('la valeur doit être un nombre', 'TypeError')
        if (value < min || value > max) this.error(`la valeur doit être comprise entre [${min} et ${max}]`, 'RangeError')

        return parseInt(value, 10)
    }

    testBoolean(value)
    {
        if (value === false || value === 'f' || value === 'false') return false
        else if (value === true || value === 't' || value === 'true') return true
        else this.error('"t" | "true" pour vrai - "f" | "false" pour faux', 'TypeError')
    }

    // --DEFAULT-COMMAND
    clear()
    {
        const children = [...this.cmd.children]

        for (let i = children.length - 2; i >= 0; i--) this.cmd.removeChild(children[i])
    }

    write(value)
    {
        this.cmd.input.value = value
        this.cmd.analyse(value)
    }

    effect(n)
    {
        this.testDefault(n) ? n = .3 : this.testNumber(n, 0, 1)

        document.querySelector(':root').style.setProperty('--effect', n)
        localStorage.setItem('effect', n)
    
        this.success('effet ' + n)

        if (n != 0) this.eco(false)
    }

    async getFps() { this.log('' + await getFps()) }

    eco(value)
    {
        value = this.testDefault(value) ? true : this.testBoolean(value)

        if (value)
        {
            this.effect(0)
            this.spring(false)
            this.presentationSnake(false)
    
            this.write('app clear click et Entrée')
        }

        localStorage.setItem('mode', value ? 'eco' : 'personnalisé')
    }

    // --UTIL
    add(name, command, storage) // ajouter function remove lié aux destroy des elements
    {
        if (!this.keyWords.includes(name)) this.keyWords.push(name)
        if (storage && !this.storageKeys.includes(name)) this.storageKeys.push(name)

        this[name] = command
    }
}

// #IMPORTS

import { writable } from 'svelte/store'

import AppSuccess from './success'
import AppError from './error'

import getFps from './fps'

// #EXPORT

export default new AppManager()