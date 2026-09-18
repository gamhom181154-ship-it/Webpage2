(() => {

    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        [...root.querySelectorAll(selector)];

    const body = document.body;
    const root = document.documentElement;

    const reduced =
        matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* ==================================================
       LOADING / BOOT SEQUENCE
    ================================================== */

    const loader = $('.loader');

    const pct = $('#loadPct');

    const loadDepth = $('#loadDepth');

    const status = $('#loadStatus');

    const progressBar =
        $('.loader-progress span');


    const statuses = [

        'CALIBRATING SONAR ARRAY...',

        'MAPPING WATER COLUMN...',

        'DETECTING BIOLOGICAL SIGNAL...',

        'CHECKING PRESSURE SENSOR...',

        'ESTABLISHING OCEAN LINK...',

        'SYSTEM ONLINE'

    ];


    if(loader){

        let progress = 0;


        const tick = setInterval(() => {

            progress = Math.min(

                100,

                progress +
                (
                    reduced
                    ? 25
                    : Math.random() * 10 + 4
                )

            );


            const value =
                Math.floor(progress);


            if(pct){

                pct.textContent =
                    String(value).padStart(3,'0') +
                    '%';

            }


            if(loadDepth){

                loadDepth.textContent =
                    'DEPTH ' +
                    String(
                        Math.floor(value * 35)
                    ).padStart(4,'0') +
                    'M';

            }


            if(progressBar){

                progressBar.style.width =
                    value + '%';

            }


            if(status){

                status.textContent =
                    statuses[
                        Math.min(
                            statuses.length - 1,
                            Math.floor(value / 18)
                        )
                    ];

            }


            if(progress >= 100){

                clearInterval(tick);

                setTimeout(() => {

                    loader.classList.add('done');

                }, reduced ? 40 : 650);

            }

        }, reduced ? 35 : 85);

    }


    /* ==================================================
       DEEP OCEAN / SCI-FI MODE
    ================================================== */

    const themeButton =
        $('#themeButton');

    const modeLabel =
        $('#modeLabel');


    const savedTheme =
        localStorage.getItem(
            'myOceanTheme'
        );


    if(savedTheme === 'tech'){

        body.classList.add(
            'surface-mode'
        );

    }


    function updateModeUI(){

        const tech =
            body.classList.contains(
                'surface-mode'
            );


        if(modeLabel){

            modeLabel.textContent =
                tech
                ? 'SCI-FI // SONAR SYSTEM'
                : 'DEEP OCEAN // BIO-LINK';

        }


        if(themeButton){

            themeButton.setAttribute(
                'aria-label',

                tech
                ? 'Switch to Deep Ocean mode'
                : 'Switch to Sci-Fi mode'
            );

        }

    }


    updateModeUI();


    themeButton?.addEventListener(
        'click',
        () => {

            body.classList.toggle(
                'surface-mode'
            );


            localStorage.setItem(

                'myOceanTheme',

                body.classList.contains(
                    'surface-mode'
                )
                ? 'tech'
                : 'ocean'

            );


            updateModeUI();

        }
    );


    /* ==================================================
       CUSTOM CURSOR
    ================================================== */

    const cursor =
        $('.cursor');


    let mx =
        innerWidth / 2;

    let my =
        innerHeight / 2;

    let cx = mx;
    let cy = my;


    addEventListener(
        'pointermove',
        event => {

            mx = event.clientX;

            my = event.clientY;


            root.style.setProperty(
                '--mx',
                mx + 'px'
            );


            root.style.setProperty(
                '--my',
                my + 'px'
            );

        },
        {
            passive:true
        }
    );


    if(cursor && !reduced){

        const follow = () => {

            cx +=
                (mx - cx) * .18;

            cy +=
                (my - cy) * .18;


            cursor.style.left =
                cx + 'px';

            cursor.style.top =
                cy + 'px';


            requestAnimationFrame(
                follow
            );

        };


        follow();

    }
    else if(cursor){

        cursor.style.display =
            'none';

    }


    $$(
        'a,button,.ocean-card,.hobby,.contact-card,.photo-card'
    ).forEach(element => {

        element.addEventListener(
            'pointerenter',
            () => {

                cursor?.classList.add(
                    'hover'
                );

            }
        );


        element.addEventListener(
            'pointerleave',
            () => {

                cursor?.classList.remove(
                    'hover'
                );

            }
        );

    });


    /* ==================================================
       DEPTH TELEMETRY
    ================================================== */

    const depth =
        $('#depthValue');

    const pressure =
        $('#pressure');

    const temp =
        $('#temp');

    const track =
        $('.depth-track i');


    function telemetry(){

        const max =
            Math.max(
                1,
                document.documentElement.scrollHeight -
                innerHeight
            );


        const p =
            Math.min(
                1,
                scrollY / max
            );


        const meters =
            Math.round(
                p * 4500
            );


        if(depth){

            depth.textContent =
                String(meters)
                .padStart(4,'0') +
                'M';

        }


        if(track){

            track.style.width =
                (p * 100) +
                '%';

        }


        if(pressure){

            pressure.textContent =
                (
                    1 + meters / 10
                ).toFixed(1);

        }


        if(temp){

            temp.textContent =
                Math.max(
                    -1,
                    24 - meters * .005
                ).toFixed(1);

        }

    }


    addEventListener(
        'scroll',
        telemetry,
        {
            passive:true
        }
    );


    telemetry();


    /* ==================================================
       SCROLL REVEAL
    ================================================== */

    const io =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if(
                            entry.isIntersecting
                        ){

                            entry.target.classList.add(
                                'show'
                            );

                        }

                    }
                );

            },
            {
                threshold:.12
            }
        );


    $$('.reveal').forEach(
        element =>
            io.observe(element)
    );


    /* ==================================================
       3D CARD TILT
    ================================================== */

    if(!reduced){

        $$('.tilt').forEach(
            card => {

                card.addEventListener(
                    'pointermove',
                    event => {

                        const rect =
                            card.getBoundingClientRect();


                        const x =
                            (event.clientX -
                                rect.left) /
                            rect.width -
                            .5;


                        const y =
                            (event.clientY -
                                rect.top) /
                            rect.height -
                            .5;


                        card.style.transform =

                            `perspective(900px)
                             rotateX(${ -y * 5 }deg)
                             rotateY(${ x * 6 }deg)
                             translateY(-4px)`;

                    }
                );


                card.addEventListener(
                    'pointerleave',
                    () => {

                        card.style.transform =
                            '';

                    }
                );

            }
        );

    }


    /* ==================================================
       LIVING DEEP SEA
    ================================================== */

    const world =
        $('.ocean-world');


    if(world){

        const lifeLayer =
            document.createElement('div');

        lifeLayer.className =
            'ocean-life-layer';


        const coral =
            document.createElement('div');

        coral.className =
            'coral-field';


        /*
            emoji,
            size,
            duration,
            delay,
            top,
            rise,
            reverse,
            opacity
        */

        const creatures = [

            ['🐟','small',23,-1,18,-18,false,.48],

            ['🐠','small',27,-7,28,25,false,.52],

            ['🐡','small',31,-12,39,-24,false,.42],

            ['🦑','medium',39,-18,47,28,false,.32],

            ['🐟','small',25,-24,57,-20,false,.48],

            ['🦈','medium',44,-30,66,-28,true,.22],

            ['🐠','small',29,-36,74,22,false,.46],

            ['🐋','large',62,-42,31,20,true,.13],

            ['🐟','small',21,-49,82,-17,false,.45],

            ['🦑','medium',43,-54,58,32,true,.24],

            ['🐡','small',33,-60,91,-23,false,.4],

            ['🐠','small',26,-67,43,18,false,.46],

            ['🦈','medium',50,-73,23,-18,false,.16],

            ['🐋','large',70,-82,72,-22,true,.10]

        ];


        creatures.forEach(
            creature => {

                const [
                    emoji,
                    size,
                    duration,
                    delay,
                    top,
                    rise,
                    reverse,
                    opacity
                ] = creature;


                const element =
                    document.createElement(
                        'span'
                    );


                element.className =
                    `ocean-creature
                     ${size}
                     ${reverse ? 'reverse' : ''}`;


                element.textContent =
                    emoji;


                element.style.setProperty(
                    '--dur',
                    duration + 's'
                );


                element.style.setProperty(
                    '--delay',
                    delay + 's'
                );


                element.style.setProperty(
                    '--top',
                    top + '%'
                );


                element.style.setProperty(
                    '--rise',
                    rise + 'px'
                );


                element.style.setProperty(
                    '--op',
                    opacity
                );


                lifeLayer.appendChild(
                    element
                );

            }
        );


        [
            3,
            14,
            27,
            41,
            55,
            69,
            83,
            95
        ].forEach(
            (left,index) => {

                const element =
                    document.createElement(
                        'div'
                    );


                element.className =
                    'coral-cluster';


                element.style.left =
                    left + '%';


                element.style.transform =
                    `scale(${
                        .48 +
                        (index % 4) * .15
                    })`;


                coral.appendChild(
                    element
                );

            }
        );


        world.append(
            lifeLayer,
            coral
        );

    }


    /* ==================================================
       RADAR TRACKING POINT
    ================================================== */

    const sonar =
        $('.sonar');


    let trackingBlip =
        $('.tracking-blip');


    if(
        sonar &&
        !trackingBlip
    ){

        trackingBlip =
            document.createElement('i');

        trackingBlip.className =
            'tracking-blip';

        sonar.appendChild(
            trackingBlip
        );

    }


    addEventListener(
        'pointermove',
        event => {

            if(
                !trackingBlip ||
                !sonar
            ){
                return;
            }


            if(
                !body.classList.contains(
                    'surface-mode'
                )
            ){

                trackingBlip.style.opacity =
                    '0';

                return;

            }


            const rect =
                sonar.getBoundingClientRect();


            const x =
                Math.max(
                    10,
                    Math.min(
                        rect.width - 10,
                        (event.clientX / innerWidth) *
                        rect.width
                    )
                );


            const y =
                Math.max(
                    10,
                    Math.min(
                        rect.height - 10,
                        (event.clientY / innerHeight) *
                        rect.height
                    )
                );


            trackingBlip.style.left =
                x + 'px';


            trackingBlip.style.top =
                y + 'px';


            trackingBlip.style.opacity =
                '1';

        },
        {
            passive:true
        }
    );


    /* ==================================================
       CLICK EFFECTS
    ================================================== */

    addEventListener(
        'click',
        event => {

            if(
                reduced ||
                event.target.closest(
                    'a,button'
                )
            ){
                return;
            }


            /*
                DEEP OCEAN
                = WATER RIPPLE
            */

            if(
                !body.classList.contains(
                    'surface-mode'
                )
            ){

                const ripple =
                    document.createElement(
                        'div'
                    );


                ripple.className =
                    'click-wave';


                ripple.style.left =
                    event.clientX + 'px';


                ripple.style.top =
                    event.clientY + 'px';


                document.body.appendChild(
                    ripple
                );


                setTimeout(
                    () => ripple.remove(),
                    950
                );

            }


            /*
                SCI-FI
                = ELECTRIC SHOCK
            */

            else{

                for(
                    let i = 0;
                    i < 6;
                    i++
                ){

                    const bolt =
                        document.createElement(
                            'i'
                        );


                    bolt.className =
                        'electric-bolt';


                    const angle =
                        Math.random() * 360 -
                        180;


                    bolt.style.left =
                        (
                            event.clientX +
                            Math.random() * 12 -
                            6
                        ) + 'px';


                    bolt.style.top =
                        (
                            event.clientY +
                            Math.random() * 12 -
                            6
                        ) + 'px';


                    bolt.style.setProperty(
                        '--angle',
                        angle + 'deg'
                    );


                    bolt.style.transform =
                        `rotate(${angle}deg)`;


                    bolt.style.width =
                        (
                            75 +
                            Math.random() * 75
                        ) + 'px';


                    document.body.appendChild(
                        bolt
                    );


                    setTimeout(
                        () => bolt.remove(),
                        420
                    );

                }

            }

        }
    );


    /* ==================================================
       PAGE TRANSITION
    ================================================== */

    $$('a').forEach(
        link => {

            const href =
                link.getAttribute(
                    'href'
                );


            if(
                !href ||
                href.startsWith('#') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                link.target === '_blank'
            ){

                return;

            }


            link.addEventListener(
                'click',
                event => {

                    if(
                        reduced ||
                        !loader
                    ){

                        return;

                    }


                    event.preventDefault();


                    loader.classList.remove(
                        'done'
                    );


                    setTimeout(
                        () => {

                            location.href =
                                href;

                        },
                        300
                    );

                }
            );

        }
    );

})();
