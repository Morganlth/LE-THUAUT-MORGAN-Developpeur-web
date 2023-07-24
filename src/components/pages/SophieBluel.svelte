<!-- #SCRIPT -->

<script>
    // #IMPORTS

        // --SCSS
        import '../../assets/scss/projects/sophiebluel/style.scss'

        // --SVELTE
        import { page } from '$app/stores'
</script>

<!-- #HTML -->

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Work+Sans&display=swap" rel="stylesheet">
</svelte:head>

<div
id="sophie-bluel"
>
    <div
    class="body"
    >
        <header>
            <h1>
                Sophie Bluel
                <span>Architecte d'inteérieur</span>
            </h1>
        
            <nav>
                <ul>
                    <li>projets</li>
                    <li>contact</li>
                    <li id="login">login</li>
                    <li><img src="{$page.url.origin}/src/assets/images/projects/sophiebluel/icons/instagram.png" alt="Instagram"></li>
                </ul>
            </nav>
        </header>

        <main>
            <section id="introduction">
                <figure>
                    <img src="{$page.url.origin}/src/assets/images/projects/sophiebluel/sophie-bluel.png" alt="Sophie Bluel">

                    <!--* Ajout d'une ancre pour les éléments d'édition -->
        
                    <figcaption class="js-anchor"></figcaption>
                </figure>
        
                <article>
                    <!--* Ajout d'une ancre pour les éléments d'édition -->
        
                    <div class="js-anchor"></div>
        
                    <h2>Designer d'espace</h2>
            
                    <p>Je raconte votre histoire, je valorise vos idées. Je vous accompagne de la conception à la livraison finale du chantier.</p>
                    <p>Chaque projet sera étudié en commun, de façon à mettre en valeur les volumes, les matières et les couleurs dans le respect de l’esprit des lieux et le choix adapté des matériaux. Le suivi du chantier sera assuré dans le souci du détail, le respect du planning et du budget.</p>
                    <p>En cas de besoin, une équipe pluridisciplinaire peut-être constituée : architecte DPLG, décorateur(trice)</p>
                </article>
            </section>
        
            <section id="portfolio">
                <!--* Ajout d'une ancre pour les éléments d'édition + div -->
        
                <div class="flex center js-anchor">
                    <h2>Mes Projets</h2>
                </div>

                <!--* Ajout d'une liste contenant l'ensemble des filtres -->

                <ul id="js-filter-module" class="flex js-module">
					<li><button data-action-id="0" class="active" type="button">Tous</button></li>
				    <li><button data-action-id="1" type="button">Objets</button></li>
                    <li><button data-action-id="2" type="button">Appartements</button></li>
                    <li><button data-action-id="3" type="button">Hotels &amp; restaurants</button></li>
                </ul>

                <!--* Suppression des éléments présent dans la gallery => import via le serveur -->
        
                <div class="gallery">
                    <figure data-work-id="1">
                        <img src="{$page.url.origin}/src/assets/images/projects/sophiebluel/gallery/abajour-tahina1651286843956.png" alt="Abajour Tahina" crossorigin="">
                        <figcaption>Abajour Tahina</figcaption>
                    </figure>
                    
                    <figure data-work-id="2">
                        <img src="{$page.url.origin}/src/assets/images/projects/sophiebluel/gallery/appartement-paris-v1651287270508.png" alt="Appartement Paris V" crossorigin="">
                        <figcaption>Appartement Paris V</figcaption>
                    </figure>
                    
                    <figure data-work-id="3">
                        <img src="{$page.url.origin}/src/assets/images/projects/sophiebluel/gallery/restaurant-sushisen-londres1651287319271.png" alt="Restaurant Sushisen - Londres" crossorigin="">
                        <figcaption>Restaurant Sushisen - Londres</figcaption>
                    </figure>
                    
                    <figure data-work-id="4">
                        <img src="{$page.url.origin}/src/assets/images/projects/sophiebluel/gallery/la-balisiere1651287350102.png" alt="Villa “La Balisiere” - Port Louis" crossorigin="">
                        <figcaption>Villa “La Balisiere” - Port Louis</figcaption>
                    </figure>
                    
                    <figure data-work-id="5">
                        <img src="{$page.url.origin}/src/assets/images/projects/sophiebluel/gallery/structures-thermopolis1651287380258.png" alt="Structures Thermopolis" crossorigin="">
                        <figcaption>Structures Thermopolis</figcaption>
                    </figure>
                    
                    <figure data-work-id="6">
                        <img src="{$page.url.origin}/src/assets/images/projects/sophiebluel/gallery/appartement-paris-x1651287435459.png" alt="Appartement Paris X" crossorigin="">
                        <figcaption>Appartement Paris X</figcaption>
                    </figure>
                    
                    <figure data-work-id="7">
                        <img src="{$page.url.origin}/src/assets/images/projects/sophiebluel/gallery/le-coteau-cassis1651287469876.png" alt="Pavillon “Le coteau” - Cassis" crossorigin="">
                        <figcaption>Pavillon “Le coteau” - Cassis</figcaption>
                    </figure>
                    
                    <figure data-work-id="8">
                        <img src="{$page.url.origin}/src/assets/images/projects/sophiebluel/gallery/villa-ferneze1651287511604.png" alt="Villa Ferneze - Isola d’Elba" crossorigin="">
                        <figcaption>Villa Ferneze - Isola d’Elba</figcaption>
                    </figure>
        
                    <figure data-work-id="9">
                        <img src="{$page.url.origin}/src/assets/images/projects/sophiebluel/gallery/appartement-paris-xviii1651287541053.png" alt="Appartement Paris XVIII" crossorigin="">
                        <figcaption>Appartement Paris XVIII</figcaption>
                    </figure>
                    
                    <figure data-work-id="10">
                        <img src="{$page.url.origin}/src/assets/images/projects/sophiebluel/gallery/bar-lullaby-paris1651287567130.png" alt="Bar “Lullaby” - Paris" crossorigin="">
                        <figcaption>Bar “Lullaby” - Paris</figcaption>
                    </figure>
                    
                    <figure data-work-id="11">
                        <img src="{$page.url.origin}/src/assets/images/projects/sophiebluel/gallery/hotel-first-arte-new-delhi1651287605585.png" alt="Hotel First Arte - New Delhi" crossorigin="">
                        <figcaption>Hotel First Arte - New Delhi</figcaption>
                    </figure>
                </div>
            </section>
    
            <section id="contact">
                <h2>Contact</h2>

                <p>Vous avez un projet ? Discutons-en !</p>
    
                <form action="#" method="post">
                    <label for="name">Nom</label>
                    <input type="text" name="name" id="name">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email">
                    <label for="message">Message</label>
                    <textarea name="message" id="message" cols="30" rows="10"></textarea>
                    <input type="submit" value="Envoyer">
                </form>
            </section>
        </main>

        <footer>
            <nav>
                <ul>
                    <li>Mentions Légales</li>
                </ul>
            </nav>
        </footer>
    </div>
</div>

<!-- #STYLE -->

<style>
    /* #DEFAULT */

    #sophie-bluel
    {
        width: 100%;

        background-color: white;

        padding: 50px 0 2em;
    }

    .body
    {
        max-width: 1140px;

        margin: auto;

        font-family: 'Work Sans' ;
        font-size: 14px;
    }

    header
    {
        display: flex;
        justify-content: space-between;

        margin-bottom: 50px;
    }

    section
    {
        margin: 50px 0;
    }

    h1
    {
        display: flex;
        flex-direction: column;

        font-family: 'Syne';
        font-size: 22px;
        font-weight: 800;
        color: #B1663C;
    }

    h1
    >span
    {
        font-family: 'Work Sans';
        font-size: 10px;
        letter-spacing: 0.1em;
    }

    h2
    {
        font-family: 'Syne';
        font-weight: 700;
        font-size: 30px;
        color: #1D6154;
    }

    nav ul
    {
        display: flex;
        align-items: center;

        list-style-type: none;
    }
    nav li
    {
        padding: 0 10px;
        font-size: 1.2em;
    }
    li:hover { color: #B1663C; }

    #introduction
    {
        display: flex;
        align-items: center;
    }
    #introduction figure { flex: 1; }
    #introduction img
    {
        display: block;

        width: 80%;
        
        margin: auto;
    }
    #introduction article { flex: 1; }
    #introduction h2 { margin-bottom: 1em; }
    #introduction p { margin-bottom: 0.5em; }

    #portfolio h2
    {
        margin-bottom: 1em;

        text-align: center;
    }

    #contact
    {
        width: 50%;

        margin: auto;
    }
    #contact
    >* { text-align: center; }
    #contact h2{ margin-bottom: 20px; }
    #contact form
    {
        display: flex;
        flex-direction: column;

        margin-top:30px;

        text-align: left;
    }
    #contact input
    {
        height: 50px;

        border: none;

        font-size: 1.2em;

        box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.09);
    }
    #contact label { margin: 2em 0 1em 0; }
    #contact textarea
    {
        border: none;

        box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.09);
    }

    input[type="submit"]
    {
        width: 180px;

        margin: 2em auto;

        background-color: #1D6154;

        border-radius: 60px;

        color: white;
        font-family: 'Syne';
        font-weight: 700;
        text-align: center;
    }

    footer nav ul
    {
        display: flex;
        justify-content: flex-end;

        margin-top: 2em;
    }
</style>