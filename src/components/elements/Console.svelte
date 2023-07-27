<!-- #SCRIPT -->

<script>
    // #IMPORTS

        // --SCSS
        import '../../assets/scss/components/console.scss'

        // --CONTEXT
        import { app } from '../field/Main.svelte'
        import { spring } from '../field/Main.svelte'

        // --JS
        import AppError from '../../assets/js/utils/error'
        import AppSuccess from '../../assets/js/utils/success'

        // --SVELTE
        import { onMount, tick } from 'svelte'

        // --COMPONENT-ELEMENT
        import Line from './Line.svelte'

    // #CONSTANTE

        // --ELEMENT-CONSOLE
        const CONSOLE_CONTAINER = []

    // #VARIABLES

        // --ELEMENT-CONSOLE
        let
        console_CMD,
        console_INPUT,
        console_CURRENTVALUE,
        console_HISTORY = ['app'],
        console_INDEX = 0,
        console_LINES = []

    // #FUNCTIONS

        // --SET
        function console_set() { console_setCommand() }

        function console_setCommand()
        {
            app.app_add('log', console_log)
            app.app_add('clear', console_clear)
        }

        // --RESET
        function console_reset()
        {
            console_update('remove')
            console_CURRENTVALUE = ''

            tick().then(() => console_CMD.scrollTop = console_CMD.scrollHeight - console_CMD.offsetHeight)
        }

        // --RESTORE
        function console_restore()
        {
            console_testRange()
            console_write(console_HISTORY[console_INDEX])
        }

        // --UPDATE
        function console_update(action, values = [])
        {
            CONSOLE_CONTAINER[0].classList[action]('app-context')

            for (let i = 0; i < CONSOLE_CONTAINER.length; i++) CONSOLE_CONTAINER[i].innerText = values[i] ?? ''
        }

        // --COMMANDS
        function console_log(msg)
        {
            const
            TYPE = msg instanceof Error ? msg instanceof AppSuccess ? 'success' : 'error' : null,
            MESSAGE = TYPE ? { name: msg.name, message: msg.message.trim() } : msg.trim()

            console_LINES = [...console_LINES, { type: TYPE, msg: MESSAGE }]
        }

        function console_clear() { console_LINES = [] }

        // --EVENTS
        function console_input()
        {
            (console_CURRENTVALUE.length === 3 || console_CURRENTVALUE[3] === ' ') && console_CURRENTVALUE.substring(0, 3) === 'app'
            ? console_analyse(console_CURRENTVALUE)
            : console_update('remove', [console_CURRENTVALUE])
        }

        function console_keyup(e)
        {
            switch (e.key)
            {
                case 'Enter':
                    if (CONSOLE_CONTAINER[0].innerText === 'app') console_execute()
                    break
                case 'ArrowUp':
                    console_INDEX--
                    console_restore()
                    break
                case 'ArrowDown':
                    console_INDEX++
                    console_restore()
                    break
                default: break
            }
        }

        // --TEST-CHECK
        function console_testRange()
        {
            if (console_INDEX < 0) console_INDEX = 0
            else if (console_INDEX >= console_HISTORY.length) console_INDEX = console_HISTORY.length-1
        }

        function check(value) { CONSOLE_CONTAINER[1].classList[app.app_KEYWORDS.includes(value.trim()) ? 'add' : 'remove']('func-context') }

        // --UTILS
        function console_analyse(value)
        {
            const VALUES = value.match(/^(app)(\s+\S*)?(\s.*)?$/)

            VALUES.shift()

            if (VALUES[1]) check(VALUES[1])

            console_update('add', VALUES)
        }

        function console_write(value)
        {
            const LENGTH = value.length
    
            console_CURRENTVALUE = value
            console_INPUT.focus()
            console_INPUT.setSelectionRange(LENGTH, LENGTH)

            console_input()
        }

        function console_execute()
        {
            const
            COMMAND = CONSOLE_CONTAINER[1].innerText.trim(),
            PARAMS = CONSOLE_CONTAINER[2].innerText.trim().split(',')

            console_HISTORY.push(console_CURRENTVALUE)
            console_INDEX = console_HISTORY.length

            try { app.app_COMMANDS[COMMAND](...PARAMS), console_reset() }
            catch (e)
            {
                const ERROR = e instanceof AppError ? e : new AppError(
                    ...(app.app_KEYWORDS.includes(COMMAND)
                    ? ['Error', 'une erreur est survenue :/']
                    : ['TypeError', `"${COMMAND}" n'est pas une commande`])
                )
    
                console_log(ERROR)
            }
        }

    // #CYCLE

    onMount(console_set)
</script>

<!-- #HTML -->

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
class="console"
on:mouseenter={spring.spring_mouseEnter.bind(spring)}
on:mouseleave={spring.spring_mouseLeave.bind(spring)}
>
    <section>
        <h3>CONSOLE</h3>

        <p>EN DÉVELOPPEMENT</p>
    </section>

    <div
    class="cmd"
    bind:this={console_CMD}
    >
        {#each console_LINES as line}
            <Line
            _type={line.type}
            _msg={line.msg}
            />
        {/each}

        <div
        class="line"
        >
            <div
            class="line-indicator"
            >
                &gt
            </div>

            <div
            class="line-content"
            >
                <input
                type="text"
                maxlength="59"
                spellcheck="false"
                bind:this={console_INPUT}
                bind:value={console_CURRENTVALUE}
                on:input={console_input}
                on:keyup|preventDefault={console_keyup}
                />

                <div
                class="mirror"
                >
                    {#each [0, 1, 2] as i}
                        <pre
                        bind:this={CONSOLE_CONTAINER[i]}
                        >
                        </pre>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/background' as *;
    @use '../../assets/scss/styles/font' as *;
    @use '../../assets/scss/styles/media' as *;

    /* #CONSOLE */

    .console
    {
        @include flex;
        @include f-column;
        @include any-w;

        gap: 10px;

        max-height: 100%;

        padding-bottom: 20px;

        box-sizing: border-box;

        section
        {
            @include flex;

            justify-content: space-between;
            align-items: flex-end;
            flex-wrap: wrap;

            gap: 5px;
        }

        h3 { @include h-2; }

        p { @include p-interact; }

        .cmd
        {
            @include any;
    
            overflow: auto;

            padding-bottom: 10px;

            border-right: solid $secondary 2px;
            border-bottom: solid $secondary 2px;

            box-sizing: border-box;

            &::-webkit-scrollbar
            {
                width: 5px;
                height: 5px;

                background-color: $dark;
            }
            &::-webkit-scrollbar-thumb { background-color: $s-light; }
            &::-webkit-scrollbar-corner { background-color: $secondary; }
        }

        @include media-min(768px)
        {
            gap: 20px;

            max-width: 1000px;
            width: 80%;

            padding-bottom: 0;
        }
        @include media-min(1024px, 768px)
        {
            height: 50%;

            padding: 30px 30px 20px;

            backdrop-filter: blur(5px);
        }
    }
</style>