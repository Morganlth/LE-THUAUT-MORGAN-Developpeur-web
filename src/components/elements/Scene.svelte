<!-- #SCRIPT -->

<script>
    // #EXPORTS

        // --PROPS
        export let
        _scale,
        _colors

        // --BIND
        export let number

    // #IMPORTS

        // --COMPONENT-ELEMENTS
        import Decor from './Decor.svelte'
        import Die from './Die.svelte'

    // #VARIABLES

        // --ELEMENT-SCENE
        let scene
</script>

<!-- #HTML -->

<div
class="scene"
bind:this={scene}
>
    <Decor
    {_scale}
    {_colors}
    />

    <div
    class="content"
    >
        <Die
        _scene={scene}
        _color={_colors.light}
        bind:number={number}
        />

        <p>CE DÉ NE SERT ABSOLUMENT A RIEN. <br> (EN COURS DE DÉVELOPPEMENT)</p>
    </div>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/font' as *;

    /* #SCENE */

    .scene
    {
        @include sticky(true);
        @include any-w;

        height: 100vh;

        .content
        {
            @include flex;
            @include f-column;
            @include f-a-center;
            @include absolute;
            @include any-w;

            justify-content: flex-end;

            bottom: 0;
            left: 0;

            height: 30vh;

            p
            {
                @include p-interact;

                margin: 30px 0;
                padding: 15px 0;

                text-align: center;
            }
        }
    }
</style>