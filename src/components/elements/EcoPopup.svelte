<!-- #SCRIPT -->

<script>
    // #IMPORT

        // --CONTEXT
        import { app } from '../field/Main.svelte'

    // #VARIABLE

    let popup

    // #FUNCTIONS

        // --CLEAR
        function clear() { popup.remove() }

        // --MODE
        function economics()
        {
            app.effect(0)
            app.spring(false)
            app.presentationSnake(false)

            app.write('app clear ?')
            
            clear()
        }
</script>

<!-- #HTML -->

<div
class="eco-popup"
bind:this={popup}
>
    <section>
        <h5>
            MANQUE DE RESSOURCES.
        </h5>

        <div
        class="content"
        >
            <p>Votre machine ne permet pas une expérience optimale.</p>

            <p>
                Nous vous conseillons de passer en mode "économique".
                <br>
                Certains paramètres seront désactivées pour amméliorer les performances de la page.
                <br>
                Vous pouvez retrouver les paramètres modifier dans la Console.
                <br>
                La command app clear est automatiquement écrite pour vous permettre de nettoyer rapidement la console.
                <br>
                Pour éxécuter la commande app clear faites un click droit sur la texte et appuyez sur la touche Entrée.
            </p>

            <p>
                Si vous souhaitez redéfinir les paramètres par défaut, vous pouvez passer par la commande app reset.
                <br>
                Vous retrouvez la liste des commandes dans la section "command" de la Console.
            </p>
        </div>

        <div
        class="choice"
        >
            <button
            type="button"
            on:click={economics}
            >
                PASSER EN MODE ÉCO
            </button>

            <button
            type="button"
            on:click={clear}
            >
                GARDER LES OPTIONS ACTUELLES
            </button>
        </div>
    </section>
</div>

<!-- #STYLE -->

<style
lang="scss"
>
    /* #IMPORTS */

    @import
    '../../assets/scss/styles/flex.scss',
    '../../assets/scss/styles/position.scss',
    '../../assets/scss/styles/size.scss',
    '../../assets/scss/styles/background.scss',
    '../../assets/scss/styles/font.scss',
    '../../assets/scss/styles/cursor.scss';

    /* #GROUPS */

    .eco-popup
    {
        @include flex;
        @include f-column;
        @include f-center;
        @include xy-start;
        @include any;
        @include black-glass(blur(10px));

        position: fixed;

        padding: 50px;

        box-sizing: border-box;

        section
        {
            width: 75%;

            padding: 60px;

            background-color: $s-dark;

            border: solid $dark 4px;

            box-sizing: border-box;
        }

        h5
        {
            @include title($light, 50px, 50px);

            margin-bottom: 30px;
        }

        .content
        {
            padding: 0 30px;
    
            border-left: solid $secondary 2px;

            box-sizing: border-box;
        }

        p
        {
            @include text-command;

            margin-bottom: 30px;

            color: $light;
        }

        /* .choice { text-align: right;} */

        button
        {
            @include text-info;
            @include pointer;
    
            padding: 8px 15px;
    
            background-color: transparent;

            color: $light;

            box-sizing: border-box;
        }
        button:nth-child(1)
        {
            margin-right: 10px;
    
            border: solid $primary 2px;

            &:hover { color: $primary; }
        }
        button:nth-child(2)
        {
            border: solid $secondary 2px;

            &:hover { color: $secondary; }
        }
    }
</style>