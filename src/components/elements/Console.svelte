<!-- #SCRIPT -->

<script>
    // #IMPORTS

        // --SCSS
        import '../../assets/scss/components/console.scss'

        // --CONTEXT
        import { app } from '../field/Main.svelte'
        import { spring } from '../field/Main.svelte'

        // --JS
        import AppError from '../../assets/js/error'

        // --SVELTE
        import { onMount } from 'svelte'

    // #CONSTANTE
    
    const children = []

    // #VARIABLES

        // --THIS
        let
        cmd,
        input,
        mirror,
        value

        // --MEMORY
        let
        history = ['app'],
        i = 0

    // #FUNCTIONS

        // --CYCLES
        function set() { app.cmd = cmd }

        function reset()
        {
            update('remove')
            value = ''
            cmd.scrollTop = cmd.scrollHeight - cmd.offsetHeight
        }

        function restore()
        {
            const
            command = history[i],
            length = command.length

            value = command
            input.focus()
            input.setSelectionRange(length, length)
            writingEvent()
        }

        function update(action, values = [])
        {
            children[0].classList[action]('app-context')

            for (let i = 0; i < children.length; i++) children[i].innerText = values[i] ?? ''
        }

        // --EVENTS
        function writingEvent()
        {
            (value.length === 3 || value[3] === ' ') && value.substring(0, 3) === 'app'
            ? analyse(value)
            : update('remove', [value])
        }

        function keyEvent(e)
        {
            const key = e.key

            switch (key)
            {
                case 'Enter':
                    if (children[0].innerText === 'app') execute()
                    break
                case 'ArrowUp':
                    if (--i < 0) i = 0
                    restore()
                    break
                case 'ArrowDown':
                    if (++i >= history.length) i = history.length-1
                    restore()
                    break
                default: break
            }
        }

        // --COMMAND-CODE
        function analyse(value)
        {
            const values = value.match(/^(app)(\s+\S*)?(\s.*)?$/)

            values.shift()

            if (values[1]) check(values[1])

            update('add', values)
        }

        function check(value) { children[1].classList[app.keyWords.includes(value.trim()) ? 'add' : 'remove']('func-context') }

        function execute()
        {
            const
            func = children[1].innerText.trim(),
            params = children[2].innerText.trim().split(',')

            history.push(value)
            i = history.length

            try
            {
                app[func](...params)

                reset()
            }
            catch (e)
            {
                const err = e instanceof AppError ? e : new AppError('TypeError', `"${func}" n'est pas une fonction valide`)
                
                app.log(err)
            }
        }

    // #CYCLE

    onMount(set)
</script>

<!-- #HTML -->

<section
class="console"
on:mouseenter={spring.spring_mouseEnter.bind(spring)}
on:mouseleave={spring.spring_mouseLeave.bind(spring)}
>
    <div>
        <h3>Console</h3>

        <p>RECHERCHER & MODIFIER</p>
    </div>

    <div
    class="cmd"
    bind:this={cmd}
    >
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
                bind:this={input}
                bind:value={value}
                on:input={writingEvent}
                on:keyup|preventDefault={keyEvent}
                />

                <div
                class="mirror"
                bind:this={mirror}
                >
                    {#each [0, 1, 2] as child}
                        <pre
                        bind:this={children[child]}
                        >
                        </pre>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</section>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/background.scss',
    '../../assets/scss/styles/font.scss';

    /* #GROUPS */

    .console
    {
        @include black-glass(hue-rotate(180deg));

        width: 50%;
        height: 50%;

        padding: 30px 40px 20px;

        border: solid $dark 4px;

        &,
        .cmd
        { box-sizing: border-box }

        &
        >div:nth-child(1)
        {
            @include flex;

            justify-content: space-between;
            align-items: flex-end;

            height: 40px;
    
            margin-bottom: 20px;
        }

        h3 { @include title-3; }

        p { @include text-info; }

        .cmd
        {
            overflow-x: hidden;
            overflow-y: auto;

            height: calc(100% - 60px); /* div:nth-child(1) height + margin */

            padding-bottom: 10px;

            border-right: solid $secondary 2px;
            border-bottom: solid $secondary 2px;

            &::-webkit-scrollbar
            {
                width: 15px;

                background-color: $dark;
            }
            &::-webkit-scrollbar-thumb
            {
                background-color: $s-light;

                border-left: solid $dark 10px;
            }
        }
    }
</style>