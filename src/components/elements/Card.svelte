<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROPS
        export let
        _id,
        _translateX,
        _translateZ,
        _rotateY

    // #IMPORT

        // --SVELTE
        import { createEventDispatcher } from 'svelte'

    // #CONSTANTE

        // --SVELTE
        const dispatch = createEventDispatcher()

    // #VARIABLE

        // --ELEMENT-CARD
        let on = false

    // #FUNCTION

        // --EVENT
        function card_click()
        {
            on = !on
        
            dispatch('click', { id: _id, on: on })
        }
</script>

<!-- #HTML -->

<div
class="card"
style:transform="translateX({_translateX ?? 0}px) translateZ({_translateZ ?? 0}px) rotateY({_rotateY ?? 0}deg)"
>
    <button
    type="button"
    on:click={card_click}
    >
        <!-- <div
        class="content"
        >
        </div> -->
    </button>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USE */

    /* @use '../../assets/scss/styles/position.scss' as *; */
    @use '../../assets/scss/styles/size.scss' as *;

    /* #GROUP */

    .card
    {
        @include any;

        flex-shrink: 0;

        transform-origin: left;

        padding: 0 25px;

        box-sizing: border-box;

        button
        {
            @include any;

            background-color: $dark;

            border: solid $light 4px;
            outline: none;

            box-sizing: border-box;

            /* .content
            {
                @include xy-start(true);

                transform: translate(-25%, -25%);

                width: 100vw;
                height: 100vh;
            } */
        }
    }
</style>