<!-- #SCRIPT -->

<script>
    // #EXPORT

        // --PROP
        export let _check = false
</script>

<!-- #HTML -->

<label
class="toggle"
>
    <input
    type="checkbox"
    checked={_check}
    on:click|stopPropagation
    >

    <slot />

    <span></span>
</label>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #USES */

    @use '../../assets/scss/styles/flex' as *;
    @use '../../assets/scss/styles/position' as *;
    @use '../../assets/scss/styles/size' as *;
    @use '../../assets/scss/styles/font' as *;
    @use '../../assets/scss/styles/cursor' as *;
    @use '../../assets/scss/styles/media' as *;

    /* #TOGGLE */

    .toggle
    {
        @include flex;
        @include f-a-center;
        @include p-interact($light);
        @include no-event;

        justify-content: space-between;
    
        gap: 20px;

        text-align: left;

        input
        {
            display: none;

            &:checked + span::after
            {
                transform: translateX(100%);

                background-color: $primary;
            }
        }

        span
        {
            @include relative;

            width: 24px;
            height: 12px;

            background-color: $dark;

            border-right: solid $light 2px;
            border-bottom: solid $light 2px;

            box-sizing: border-box;

            &::after
            {
                @include xy-start(true);
                @include any-h;
            
                content: '';

                width: 50%;

                background-color: $secondary;

                transition: transform .4s;
            }

            @include media-min(768px, 425px)
            {
                width: 30px;
                height: 16px;
            }
        }
    }
</style>