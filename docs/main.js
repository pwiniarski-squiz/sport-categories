var jsonObj = {
    start: 0,
    sum: 0,
    getJSON: async function(data) {
        var response = await fetch(data);
        var json = await response.json();
        this.getCategories(json.data);
    },
    getCategories: function(data) {
        var jsondata = data;
        this.makeCategories(jsondata);
    },
    makeCategories: function(jsondata) {
        var self = this;
        var categories = jsondata;
        var wrapper = document.createElement("div");
        wrapper.classList.add('categories');

        categories.forEach(function(el, i) {
            if (el.level === 1) {
                wrapper.innerHTML += self.createLvl1(el);
            }
        });

        var subcategories = categories.filter(function(el) {
            return el.level === 2;
        });
        var lowestcategories = categories.filter(function(el) {
            return el.level === 3;
        });
        subcategories.forEach(function(el) {
            var cat = wrapper.querySelector('.menu-lvl1[data-categoryid="' + el.parentCategory + '"]');
            if (cat) {
                cat.lastChild.innerHTML += self.createLvl2(el);
            }
        });
        lowestcategories.forEach(function(el) {
            var lastcat = wrapper.querySelector('.lvl2[data-categoryid="' + el.parentCategory + '"]');
            if (lastcat) {
                lastcat.lastChild.innerHTML += self.createLvl3(el);
            }
        });
        document.querySelector('.sportCategories').appendChild(wrapper);
    },
    sortCategories: function(a, b) {
        return (a.dataset.sortOrder < b.dataset.sortOrder ? 1 : -1);
    },
    createLvl1: function(elm) {
        var cat = '<div class="row item menu-lvl menu-lvl1" data-categoryid="' + elm.categoryId + '" data-sortOrder="' + elm.sortOrder + '">' +
            '<div class=" heading sport-heading">' +
            '<span class="categoryName">' + elm.categoryName + '</span><div class="events-count">' + elm.eventsCount + '</div>' +
            '</div><ul class="menu-lvl menu-lvl2 close"></ul>' +
            '</div>';

        return cat;
    },
    createLvl2: function(elm) {
        var subcat = '<li class="lvl2" data-categoryid="' + elm.categoryId + '" data-parentcategory="' + elm.parentCategory + '" data-sortOrder="' + elm.sortOrder + '">' +
            '<div class="heading league-heading"><span class="categoryName">' + elm.categoryName + '</span>' +
            '<div class="events-count">' + elm.eventsCount + '</div></div><ul class="list-unstyled menu-lvl menu-lvl3 close"></ul></li>';

        return subcat;
    },
    createLvl3: function(elm) {
        var lastcat = '<li class="lvl3" data-categoryid="' + elm.categoryId + '" data-parentcategory="' + elm.parentCategory + '" data=sortOrder="' + elm.sortOrder + '"><label class="checkbox"><input class="mark" type="checkbox"></label><span class="category-link">' + elm.categoryName + '</span></li>'

        return lastcat;
    },
    findAncestor: function(el, sel) {
        if (typeof el.closest === 'function') {
            return el.closest(sel) || null;
        }
        while (el) {
            if (el.matches(sel)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    },
    accordionActions: function(el) {
        var parent = jsonObj.findAncestor(el.target, '.menu-lvl');
        if (parent && parent.matches(".menu-lvl1")) {
            var menulevel2 = parent.querySelector('.menu-lvl2');
            var events_count = parent.querySelector('.events-count');
            parent.querySelector('.events-count').classList.add('active')
            if (menulevel2.classList.contains('close')) {
                events_count.classList.add('active');
                menulevel2.classList.remove('close');
                menulevel2.classList.add('open');
                //menulevel2.style.height = menulevel2.children.length * menulevel2.children[0].clientHeight + "px";
            } else {
                events_count.classList.remove('active');
                menulevel2.classList.remove('open');
                menulevel2.classList.add('close');
            }
            return false;
        }
        if (parent && parent.matches(".menu-lvl2")) {
            parent = jsonObj.findAncestor(el.target, '.lvl2');
            var events_count = parent.querySelector('.events-count');
            var menulevel3 = parent.querySelector('.menu-lvl3');
            if (menulevel3.classList.contains('close')) {
                events_count.classList.add('active');
                menulevel3.classList.remove('close');
                menulevel3.classList.add('open');
            } else {
                events_count.classList.remove('active');
                menulevel3.classList.remove('open');
                menulevel3.classList.add('close');
            }
            return false;
        }
    },
    /*animateList: function(timestamp, el) {
        if (!self) var self = this;
        if (!self.sum && el !== undefined) self.sum = el.children.length * el.children[0].clientHeight;
        if (!self.start) self.start = timestamp;
        var progress = timestamp - self.start;
        el.clientHeight += Math.min(Math.floor(progress / 10), self.sum);
        el.style.height = el.clientHeight + "px";
        if (el.clientHeight < self.sum) {
            window.requestAnimationFrame(function() {
                self.animateList(Date.now(), el);
            });
        }
    }*/
};

document.addEventListener('DOMContentLoaded', function(event) {

    jsonObj.getJSON('https://www.lionsbet.com/rest/market/categories');
    //jsonObj.getJSON('http://localhost/categories.json');
    document.getElementsByClassName('sportCategories')[0].addEventListener('click', jsonObj.accordionActions, true);
});