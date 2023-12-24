/**
 * Load event listeners for keydown, click, and touch events.
 */
function loadEventListeners() {
    // Add keydown event listeners for search input elements
    addOnkeyDownEventListeners();

    // Add click event listeners for search elements
    addOnClickEventListeners();

    // Add touchstart event listeners for search elements
    addOnTouchStartEventListeners();
}

/**
 * Adds keydown event listeners to search input elements.
 */
function addOnkeyDownEventListeners() {
    var searchInputResponsive = document.getElementById("search-input-responsive");
    if (searchInputResponsive) {
        searchInputResponsive.addEventListener("keyup", function (event) {
            filter = document.getElementById("search-input-responsive").value;
            loadTasksHTML(filter);
        });
    }

    // Add event listener to the element with the ID "search-input"
    var searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("keyup", function (event) {
            filter = document.getElementById("search-input").value;
            filter = filter.toLowerCase();
            loadTasksHTML(filter);
        });
    }
}

/**
 * Adds click event listeners to search elements.
 */
function addOnClickEventListeners() {
    // Add event listener to the element with the ID "search-responsive"
    var searchResponsive = document.getElementById("search-responsive");
    if (searchResponsive) {
        searchResponsive.addEventListener("click", function (event) {
            filter = document.getElementById("search-responsive").value;
            loadTasksHTML(filter);
        });
    }

    // Add event listener to the element with the ID "search"
    var search = document.getElementById("search");
    if (search) {
        search.addEventListener("click", function (event) {
            filter = document.getElementById("search-input").value;
            loadTasksHTML(filter);
        });
    }
}

/**
 * Adds touchstart event listeners to search elements.
 */
function addOnTouchStartEventListeners() {
    // Add event listener to the element with the ID "search-responsive"
    var searchResponsive = document.getElementById("search-responsive");
    if (searchResponsive) {
        searchResponsive.addEventListener(
            "touchstart",
            function (event) {
                filter = document.getElementById("search-input").value;
                loadTasksHTML(filter);
            },
            { passive: true }
        );
    }

    // Add event listener to the element with the ID "search"
    var search = document.getElementById("search");
    if (search) {
        search.addEventListener(
            "touchstart",
            function (event) {
                filter = document.getElementById("search-input").value;
                loadTasksHTML(filter);
            },
            { passive: true }
        );
    }
}
