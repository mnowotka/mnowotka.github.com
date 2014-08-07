// Instantiate the object
var I18n = I18n || {};
I18n.defaultLocale = "en", I18n.fallbacks = !1, I18n.defaultSeparator = ".", I18n.locale = null, I18n.PLACEHOLDER = /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm, I18n.isValidNode = function(e, t, n) {
    return e[t] !== null && e[t] !== n
}, I18n.lookup = function(e, t) {
    var t = t || {},
        n = e,
        r = this.prepareOptions(I18n.translations),
        i = r[t.locale || I18n.currentLocale()],
        t = this.prepareOptions(t),
        s;
    if (!i) return;
    typeof e == "object" && (e = e.join(this.defaultSeparator)), t.scope && (e = t.scope.toString() + this.defaultSeparator + e), e = e.split(this.defaultSeparator);
    while (e.length > 0) {
        s = e.shift(), i = i[s];
        if (!i) {
            I18n.fallbacks && !t.fallback && (i = I18n.lookup(n, this.prepareOptions({
                locale: I18n.defaultLocale,
                fallback: !0
            }, t)));
            break
        }
    }
    return !i && this.isValidNode(t, "defaultValue") && (i = t.defaultValue), i
}, I18n.prepareOptions = function() {
    var e = {},
        t, n = arguments.length;
    for (var r = 0; r < n; r++) {
        t = arguments[r];
        if (!t) continue;
        for (var i in t) this.isValidNode(e, i) || (e[i] = t[i])
    }
    return e
}, I18n.interpolate = function(e, t) {
    t = this.prepareOptions(t);
    var n = e.match(this.PLACEHOLDER),
        r, i, s;
    if (!n) return e;
    for (var o = 0; r = n[o]; o++) s = r.replace(this.PLACEHOLDER, "$1"), i = t[s], this.isValidNode(t, s) || (i = "[missing " + r + " value]"), regex = new RegExp(r.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}")), e = e.replace(regex, i);
    return e
}, I18n.translate = function(e, t) {
    t = this.prepareOptions(t);
    var n = this.lookup(e, t);
    try {
        return typeof n == "object" ? typeof t.count == "number" ? this.pluralize(t.count, e, t) : n : this.interpolate(n, t)
    } catch (r) {
        return this.missingTranslation(e)
    }
}, I18n.localize = function(e, t) {
    switch (e) {
        case "currency":
            return this.toCurrency(t);
        case "number":
            return e = this.lookup("number.format"), this.toNumber(t, e);
        case "percentage":
            return this.toPercentage(t);
        default:
            return e.match(/^(date|time)/) ? this.toTime(e, t) : t.toString()
    }
}, I18n.parseDate = function(e) {
    var t, n;
    if (typeof e == "object") return e;
    t = e.toString().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?(Z|\+0000)?/);
    if (t) {
        for (var r = 1; r <= 6; r++) t[r] = parseInt(t[r], 10) || 0;
        t[2] -= 1, t[7] ? n = new Date(Date.UTC(t[1], t[2], t[3], t[4], t[5], t[6])) : n = new Date(t[1], t[2], t[3], t[4], t[5], t[6])
    } else typeof e == "number" ? (n = new Date, n.setTime(e)) : e.match(/\d+ \d+:\d+:\d+ [+-]\d+ \d+/) ? (n = new Date, n.setTime(Date.parse(e))) : (n = new Date, n.setTime(Date.parse(e)));
    return n
}, I18n.toTime = function(e, t) {
    var n = this.parseDate(t),
        r = this.lookup(e);
    return n.toString().match(/invalid/i) ? n.toString() : r ? this.strftime(n, r) : n.toString()
}, I18n.strftime = function(e, t) {
    var n = this.lookup("date");
    if (!n) return e.toString();
    n.meridian = n.meridian || ["AM", "PM"];
    var r = e.getDay(),
        i = e.getDate(),
        s = e.getFullYear(),
        o = e.getMonth() + 1,
        u = e.getHours(),
        a = u,
        f = u > 11 ? 1 : 0,
        l = e.getSeconds(),
        c = e.getMinutes(),
        h = e.getTimezoneOffset(),
        p = Math.floor(Math.abs(h / 60)),
        d = Math.abs(h) - p * 60,
        v = (h > 0 ? "-" : "+") + (p.toString().length < 2 ? "0" + p : p) + (d.toString().length < 2 ? "0" + d : d);
    a > 12 ? a -= 12 : a === 0 && (a = 12);
    var m = function(e) {
            var t = "0" + e.toString();
            return t.substr(t.length - 2)
        },
        g = t;
    return g = g.replace("%a", n.abbr_day_names[r]), g = g.replace("%A", n.day_names[r]), g = g.replace("%b", n.abbr_month_names[o]), g = g.replace("%B", n.month_names[o]), g = g.replace("%d", m(i)), g = g.replace("%e", i), g = g.replace("%-d", i), g = g.replace("%H", m(u)), g = g.replace("%-H", u), g = g.replace("%I", m(a)), g = g.replace("%-I", a), g = g.replace("%m", m(o)), g = g.replace("%-m", o), g = g.replace("%M", m(c)), g = g.replace("%-M", c), g = g.replace("%p", n.meridian[f]), g = g.replace("%S", m(l)), g = g.replace("%-S", l), g = g.replace("%w", r), g = g.replace("%y", m(s)), g = g.replace("%-y", m(s).replace(/^0+/, "")), g = g.replace("%Y", s), g = g.replace("%z", v), g
}, I18n.toNumber = function(e, t) {
    t = this.prepareOptions(t, this.lookup("number.format"), {
        precision: 3,
        separator: ".",
        delimiter: ",",
        strip_insignificant_zeros: !1
    });
    var n = e < 0,
        r = Math.abs(e).toFixed(t.precision).toString(),
        i = r.split("."),
        s, o = [],
        u;
    e = i[0], s = i[1];
    while (e.length > 0) o.unshift(e.substr(Math.max(0, e.length - 3), 3)), e = e.substr(0, e.length - 3);
    u = o.join(t.delimiter), t.precision > 0 && (u += t.separator + i[1]), n && (u = "-" + u);
    if (t.strip_insignificant_zeros) {
        var a = {
            separator: new RegExp(t.separator.replace(/\./, "\\.") + "$"),
            zeros: /0+$/
        };
        u = u.replace(a.zeros, "").replace(a.separator, "")
    }
    return u
}, I18n.toCurrency = function(e, t) {
    return t = this.prepareOptions(t, this.lookup("number.currency.format"), this.lookup("number.format"), {
        unit: "$",
        precision: 2,
        format: "%u%n",
        delimiter: ",",
        separator: "."
    }), e = this.toNumber(e, t), e = t.format.replace("%u", t.unit).replace("%n", e), e
}, I18n.toHumanSize = function(e, t) {
    var n = 1024,
        r = e,
        i = 0,
        s, o;
    while (r >= n && i < 4) r /= n, i += 1;
    return i === 0 ? (s = this.t("number.human.storage_units.units.byte", {
        count: r
    }), o = 0) : (s = this.t("number.human.storage_units.units." + [null, "kb", "mb", "gb", "tb"][i]), o = r - Math.floor(r) === 0 ? 0 : 1), t = this.prepareOptions(t, {
        precision: o,
        format: "%n%u",
        delimiter: ""
    }), e = this.toNumber(r, t), e = t.format.replace("%u", s).replace("%n", e), e
}, I18n.toPercentage = function(e, t) {
    return t = this.prepareOptions(t, this.lookup("number.percentage.format"), this.lookup("number.format"), {
        precision: 3,
        separator: ".",
        delimiter: ""
    }), e = this.toNumber(e, t), e + "%"
}, I18n.pluralize = function(e, t, n) {
    var r;
    try {
        r = this.lookup(t, n)
    } catch (i) {}
    if (!r) return this.missingTranslation(t);
    var s;
    n = this.prepareOptions(n), n.count = e.toString();
    switch (Math.abs(e)) {
        case 0:
            s = this.isValidNode(r, "zero") ? r.zero : this.isValidNode(r, "none") ? r.none : this.isValidNode(r, "other") ? r.other : this.missingTranslation(t, "zero");
            break;
        case 1:
            s = this.isValidNode(r, "one") ? r.one : this.missingTranslation(t, "one");
            break;
        default:
            s = this.isValidNode(r, "other") ? r.other : this.missingTranslation(t, "other")
    }
    return this.interpolate(s, n)
}, I18n.missingTranslation = function() {
    var e = '[missing "' + this.currentLocale(),
        t = arguments.length;
    for (var n = 0; n < t; n++) e += "." + arguments[n];
    return e += '" translation]', e
}, I18n.currentLocale = function() {
    return I18n.locale || I18n.defaultLocale
}, I18n.t = I18n.translate, I18n.l = I18n.localize, I18n.p = I18n.pluralize;
var I18n = I18n || {};
I18n.translations = {
    en: {
        date: {
            formats: {
                "default": "%Y-%m-%d",
                "short": "%b %d",
                "long": "%B %d, %Y"
            },
            day_names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            abbr_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            month_names: [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            abbr_month_names: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            order: ["year", "month", "day"]
        },
        time: {
            formats: {
                "default": "%a, %d %b %Y %H:%M:%S %z",
                "short": "%d %b %H:%M",
                "long": "%B %d, %Y %H:%M"
            },
            am: "am",
            pm: "pm"
        },
        support: {
            array: {
                words_connector: ", ",
                two_words_connector: " and ",
                last_word_connector: ", and "
            }
        },
        errors: {
            format: "%{attribute} %{message}",
            messages: {
                inclusion: "is not included in the list",
                exclusion: "is reserved",
                invalid: "is invalid",
                confirmation: "doesn't match confirmation",
                accepted: "must be accepted",
                empty: "can't be empty",
                blank: "can't be blank",
                too_long: "is too long (maximum is %{count} characters)",
                too_short: "is too short (minimum is %{count} characters)",
                wrong_length: "is the wrong length (should be %{count} characters)",
                not_a_number: "is not a number",
                not_an_integer: "must be an integer",
                greater_than: "must be greater than %{count}",
                greater_than_or_equal_to: "must be greater than or equal to %{count}",
                equal_to: "must be equal to %{count}",
                less_than: "must be less than %{count}",
                less_than_or_equal_to: "must be less than or equal to %{count}",
                odd: "must be odd",
                even: "must be even"
            }
        },
        activerecord: {
            errors: {
                messages: {
                    taken: "has already been taken",
                    record_invalid: "Validation failed: %{errors}"
                }
            }
        },
        number: {
            format: {
                separator: ".",
                delimiter: ",",
                precision: 3,
                significant: !1,
                strip_insignificant_zeros: !1
            },
            currency: {
                format: {
                    format: "%u%n",
                    unit: "$",
                    separator: ".",
                    delimiter: ",",
                    precision: 2,
                    significant: !1,
                    strip_insignificant_zeros: !1
                }
            },
            percentage: {
                format: {
                    delimiter: ""
                }
            },
            precision: {
                format: {
                    delimiter: ""
                }
            },
            human: {
                format: {
                    delimiter: "",
                    precision: 3,
                    significant: !0,
                    strip_insignificant_zeros: !0
                },
                storage_units: {
                    format: "%n %u",
                    units: {
                        "byte": {
                            one: "Byte",
                            other: "Bytes"
                        },
                        kb: "KB",
                        mb: "MB",
                        gb: "GB",
                        tb: "TB"
                    }
                },
                decimal_units: {
                    format: "%n %u",
                    units: {
                        unit: "",
                        thousand: "Thousand",
                        million: "Million",
                        billion: "Billion",
                        trillion: "Trillion",
                        quadrillion: "Quadrillion"
                    }
                }
            }
        },
        datetime: {
            distance_in_words: {
                half_a_minute: "half a minute",
                less_than_x_seconds: {
                    one: "less than 1 second",
                    other: "less than %{count} seconds"
                },
                x_seconds: {
                    one: "1 second",
                    other: "%{count} seconds"
                },
                less_than_x_minutes: {
                    one: "less than a minute",
                    other: "less than %{count} minutes"
                },
                x_minutes: {
                    one: "1 minute",
                    other: "%{count} minutes"
                },
                about_x_hours: {
                    one: "about 1 hour",
                    other: "about %{count} hours"
                },
                x_days: {
                    one: "1 day",
                    other: "%{count} days"
                },
                about_x_months: {
                    one: "about 1 month",
                    other: "about %{count} months"
                },
                x_months: {
                    one: "1 month",
                    other: "%{count} months"
                },
                about_x_years: {
                    one: "about 1 year",
                    other: "about %{count} years"
                },
                over_x_years: {
                    one: "over 1 year",
                    other: "over %{count} years"
                },
                almost_x_years: {
                    one: "almost 1 year",
                    other: "almost %{count} years"
                }
            },
            prompts: {
                year: "Year",
                month: "Month",
                day: "Day",
                hour: "Hour",
                minute: "Minute",
                second: "Seconds"
            }
        },
        helpers: {
            select: {
                prompt: "Please select"
            },
            submit: {
                create: "Create %{model}",
                update: "Update %{model}",
                submit: "Save %{model}"
            },
            button: {
                create: "Create %{model}",
                update: "Update %{model}",
                submit: "Save %{model}"
            }
        },
        my_account2: "Hello world",
        results_header_title: "Search Results",
        results_header_forksearch: "Fork Search",
        results_header_newsearch: "New Search",
        results_subheader_curent_title: "Your current query",
        results_subheader_actions_title: "Actions",
        results_subheader_actions_selectedstructs: "Get documents for selected structures",
        results_subheader_actions_allstructs: "Get documents for all structures on this page",
        results_loader_top: "Your search results are loading...",
        results_loader_bottom: "This can take a couple of seconds, but please have patience",
        results_meta_showing: "Showing",
        results_meta_total_hits_html: "of <span class=total_hits_data></span> total results",
        results_meta_viewresultsas: "View results as:",
        results_meta_matrix: "Matrix",
        results_meta_table: "Table",
        results_document_load_top: "Your documents are currently being fetched and processed",
        results_document_load_bottom: "This can take a few seconds, your results will appear momentarily",
        results_table_title_check: "Check",
        results_table_title_structimage: "Structure Image",
        results_table_title_cheminfo: "Chemical Information",
        results_table_title_molweight: "Mol Weight",
        results_table_title_external: "External Resources",
        status_resultsfound: "Results Found",
        status_inprogress: "In progress...",
        status_viewresults: "View results",
        status_cancelsearch: "Cancel search",
        status_searchfinished: "Your search has finished!",
        status_forward: "You will be automatically forwarded to the results momentarily",
        status_status_currentlyexamining: "Currently examining chemical ID",
        status_support: "Status page help",
        global: {
            error: {
                load_error: "Error",
                related_support: "Related support articles",
                explantion: "What is a {{errorName}} error?",
                cant_find: "Why can't I find a {{viewName}}?",
                dissappeared: "Why has my {{viewName}} dissappeared?",
                how_work: "How does the {{viewName}} page work?",
                start_again: "Start again",
                reload: "Reload the page",
                new_search: "Start a new search",
                "404_message_html": "The {{viewName}} you were requesting could not be found, does not exist or may have expired ({{viewName}}'s can be created and/or amended within your SureChem session and can therefore expire when it ends). If the problem persists, please submit a <a href=mailto:support@surechem.com>support ticket.</a>.",
                "502_message_html": "There was a communication error, please reload the page and try again later. If the problem persists, please submit a <a href=mailto:support@surechem.com>support ticket.</a>.",
                "403_message_html": "You do not have permission to access this resource. If you believe this is an error, please submit a <a href=mailto:support@surechem.com>support ticket.</a>."
            },
            bad_auth_html: "There was a problem with your session, please <a href=/sessions/new/>login</a> and try again.",
            notification: {
                error: "There has been an error ({{error}}) with our API. Please reload the page, and if the problem persists <a href=mailto:support@surechem.com>submit a support ticket"
            }
        },
        status: {
            confirm: "This was a problem with your search, click OK to reload the page or cancel to start a new search",
            sure: "Are you sure you want to stop the search?",
            stopped: "Your search has been stopped"
        },
        results: {
            select_structures: "Please select some results before trying use the bulk functions",
            select_results: "Please select some results before trying to get documents",
            zero_hits: "Your search returned 0 hits"
        },
        doc: {
            tooltip: {
                close: "Close",
                multi_title: "Structures for this name:",
                loading_external: "Loading external data..."
            },
            nav: {
                last_html: "You're currently viewing the last result. If you're looking for more, try a <a href=/search/ target=_blanks>new search</a>.<span href=# onclick=$.modal.close(); class=modal-close>Close</span>"
            },
            modal: {
                chem_name: "Name:",
                smiles: "SMILES:",
                inchi: "InChi:",
                inchi_key: "InChi key:"
            }
        },
        chemical: {
            is_element: "Is element?",
            mol: "Mol weight"
        },
        global_my_account: "My Account",
        global_my_documents: "My Documents",
        global_my_structures: "My Structures",
        global_saved_searchs: "Saved Searches",
        global_account_overview: "Account Overview",
        global_account_settings: "Account Settings",
        global_manage_account: "Manage Account",
        global_billing: "Billing",
        global_logout: "Logout",
        global_support: "Support",
        global_contactus: "Contact Us",
        global_blog: "Blog",
        global_terms: "Terms and Conditions",
        global_privacy: "Privacy Policy",
        global_business: "More about SureChem",
        global_copyright: "2011 Macmillan Publishers Limited. All Rights Reserved.",
        login_welcome_html: "Welcome to <span>SureChemOpen</span>",
        login_session_expired: "Your session has expired, please login and try again",
        login_bad_auth: "You do not have permission to access that page",
        login_main_text: "To access patent chemistry search on SureChem, you need to log in or create a free account with Digital Science. This will enable you to not only access SureChemOpen but other Digital Science products as they become available.",
        login_login: "Login",
        login_signup: "Sign up",
        login_learnmore_html: "Learn more about <a href=https://www.surechem.com>SureChem</a>",
        four_title: "The page you are looking for (https://open.surechem.com/%{requested}) does not exist or has moved",
        four_why: "Why did this happen? There are a couple of possible reasons:",
        four_reason_one: "The page you requested has been moved or deleted by us. We try to redirect all our links when we do this, but it's still possible!",
        four_reason_two: "You may have mistyped the URL into the address bar",
        four_reason_three: "There may be a temporary internal error at SureChem",
        four_how: "What can you do about it? Again, there are a few things you can do:",
        four_action_one: "Make sure the URL are requesting is typed properly",
        four_action_two_html: "If you're sure the URL should exist, feel free to <a href=javascript:UserVoice.showPopupWidget();>submit a support ticket</a> and we'll be happy to try and help",
        four_action_three_html: "You can also learn more about 404 errors <a href=http://support.surechem.com/knowledgebase/articles/76718-what-is-a-404-page->at our support portal</a>",
        five_title: "There was an internal server error. We have been notified and will take action accordingly.",
        searchform_child_notice_html: "This is a child search, you can <a href='/search/results/%{url}/'>go back to the parent search results</a> any time",
        searchform_sq_example_html: "<span>Example:</span>EP0555555; 2011058149; roche OR sanofi; C07D048704; GPCR*; pyridine &quot;psychotic disorder&quot;<br /> pn: WO2011058149A1; pa:(bayer OR astra OR novartis OR Genentech OR merck) AND desc:(chemotherap* AND (&quot;Phosphoinositide 3-kinases&quot;~3 OR Pi3K))",
        searchform_sq_placeholder_html: "Enter your SureQuery&trade;",
        searchform_sq_help: "SureQuery Help",
        searchform_sq_quick_reference_guide: "Quick Reference Guide",
        searchform_fielded_search_label: "Fielded Search",
        searchform_fielded_clear: "Clear form",
        searchform_ff_keyword_label: "Search for Keyword(s)",
        searchform_ff_keyword_example_html: "Example: &quot;kinase inhibitor&quot; AND (tyrosine OR serine) NOT MAP; &quot;vaccin adjuvant&quot;~10; sul*ur; sterili?e",
        searchform_ff_docsection_label: "In doc sections",
        searchform_ff_docsection_all: "All",
        searchform_ff_docsection_combined: "Title or Abstract",
        searchform_ff_docsection_claims: "Claims",
        searchform_ff_docsection_description: "Description",
        searchform_ff_help: "Fielded form help",
        searchform_ff_bib_title: "Bibliographic Fields",
        searchform_meta_authorities_title: "Patent Authorities",
        searchform_meta_authorities_title_tooltip: "Click here for more information on our coverage",
        searchform_meta_authorities_all: "All authorities (inc. DocDB)",
        searchform_meta_authorities_allannotated: "All chemically annotated authorities",
        searchform_meta_authorities_us_apps: "US Applications",
        searchform_meta_authorities_us_granted: "US Granted",
        searchform_meta_authorities_ep_applications: "EP Applications",
        searchform_meta_authorities_ep_granted: "EP Granted",
        searchform_meta_authorities_wo: "WO",
        searchform_meta_authorities_jp: "JP",
        searchform_meta_pd_title: "Publication Date",
        searchform_meta_pd_example: "Example: YYYYMMDD; YYYY; YYYYMMDD TO YYYYMMDD; YYYY TO YYYY",
        searchform_meta_ss_label: "Save Search?",
        searchform_meta_ss_placeholder: "Search label...",
        searchform_meta_button: "Search",
        searchform_struct_input: "Manual structure input",
        searchform_struct_molfilter_label: "Filter by Molecular Weight",
        searchform_struct_type_title: "Select Structure Search",
        searchform_struct_type_substructure: "Substructure",
        searchform_struct_type_duplicate: "Duplicate",
        searchform_struct_type_identical: "Identical",
        searchform_struct_type_exact: "Exact",
        searchform_struct_type_basic: "Basic",
        searchform_struct_type_major: "Major Match",
        searchform_struct_type_similarity: "Similarity",
        searchform_struct_type_tanimoto_label: "Select Tanimoto Coefficent...",
        searchform_struct_remove: "Select Tanimoto Coefficent...",
        searchform_struct_section_label: "Search for structure in doc section(s)",
        searchform_struct_section_all: "All",
        searchform_struct_section_combined: "Title or Abstract",
        searchform_struct_section_claims: "Claims",
        searchform_struct_section_description: "Description",
        searchform_struct_section_images: "Images",
        searchform_struct_section_comingsoon: "Structure searches in document sections are coming soon",
        searchform_cov_title: "Our Chemistry Annotation Coverage",
        searchform_cov_text_top: "Chemistry annotations for US, EP, WO full text and JP abstracts are now available as follows:",
        searchform_cov_text_structs_text_html: "Structures from <em>text</em> annotations:",
        searchform_cov_text_structs_image_html: "Structures from <em>images</em>:",
        searchform_cov_text_structs_image_date_html: "from <em>Jan 1, 2007</em> to date",
        searchform_cov_text_structs_text_date: "from Jan 1, 1976 to date",
        searchform_cov_table_title_country: "Country/Authority",
        searchform_cov_table_title_data: "Data",
        searchform_cov_table_title_description: "Description (language)",
        searchform_cov_table_title_years: "Years",
        searchform_cov_db: "Find out about our database coverage",
        searchform_modal_save: "Save and Return",
        searchform_modal_close: "Close and discard",
        searchform_modal_help: "Drawing structures help",
        searchform_help: "Search form help",
        doc_loading: "Loading..."
    }
},
function(e, t) {
    function u(e) {
        var t = o[e] = {},
            n, r;
        e = e.split(/\s+/);
        for (n = 0, r = e.length; n < r; n++) t[e[n]] = !0;
        return t
    }

    function c(e, n, r) {
        if (r === t && e.nodeType === 1) {
            var i = "data-" + n.replace(l, "-$1").toLowerCase();
            r = e.getAttribute(i);
            if (typeof r == "string") {
                try {
                    r = r === "true" ? !0 : r === "false" ? !1 : r === "null" ? null : s.isNumeric(r) ? +r : f.test(r) ? s.parseJSON(r) : r
                } catch (o) {}
                s.data(e, n, r)
            } else r = t
        }
        return r
    }

    function h(e) {
        for (var t in e) {
            if (t === "data" && s.isEmptyObject(e[t])) continue;
            if (t !== "toJSON") return !1
        }
        return !0
    }

    function p(e, t, n) {
        var r = t + "defer",
            i = t + "queue",
            o = t + "mark",
            u = s._data(e, r);
        u && (n === "queue" || !s._data(e, i)) && (n === "mark" || !s._data(e, o)) && setTimeout(function() {
            !s._data(e, i) && !s._data(e, o) && (s.removeData(e, r, !0), u.fire())
        }, 0)
    }

    function H() {
        return !1
    }

    function B() {
        return !0
    }

    function W(e) {
        return !e || !e.parentNode || e.parentNode.nodeType === 11
    }

    function X(e, t, n) {
        t = t || 0;
        if (s.isFunction(t)) return s.grep(e, function(e, r) {
            var i = !!t.call(e, r, e);
            return i === n
        });
        if (t.nodeType) return s.grep(e, function(e, r) {
            return e === t === n
        });
        if (typeof t == "string") {
            var r = s.grep(e, function(e) {
                return e.nodeType === 1
            });
            if (q.test(t)) return s.filter(t, r, !n);
            t = s.filter(t, r)
        }
        return s.grep(e, function(e, r) {
            return s.inArray(e, t) >= 0 === n
        })
    }

    function V(e) {
        var t = $.split("|"),
            n = e.createDocumentFragment();
        if (n.createElement)
            while (t.length) n.createElement(t.pop());
        return n
    }

    function at(e, t) {
        return s.nodeName(e, "table") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function ft(e, t) {
        if (t.nodeType !== 1 || !s.hasData(e)) return;
        var n, r, i, o = s._data(e),
            u = s._data(t, o),
            a = o.events;
        if (a) {
            delete u.handle, u.events = {};
            for (n in a)
                for (r = 0, i = a[n].length; r < i; r++) s.event.add(t, n, a[n][r])
        }
        u.data && (u.data = s.extend({}, u.data))
    }

    function lt(e, t) {
        var n;
        if (t.nodeType !== 1) return;
        t.clearAttributes && t.clearAttributes(), t.mergeAttributes && t.mergeAttributes(e), n = t.nodeName.toLowerCase(), n === "object" ? t.outerHTML = e.outerHTML : n !== "input" || e.type !== "checkbox" && e.type !== "radio" ? n === "option" ? t.selected = e.defaultSelected : n === "input" || n === "textarea" ? t.defaultValue = e.defaultValue : n === "script" && t.text !== e.text && (t.text = e.text) : (e.checked && (t.defaultChecked = t.checked = e.checked), t.value !== e.value && (t.value = e.value)), t.removeAttribute(s.expando), t.removeAttribute("_submit_attached"), t.removeAttribute("_change_attached")
    }

    function ct(e) {
        return typeof e.getElementsByTagName != "undefined" ? e.getElementsByTagName("*") : typeof e.querySelectorAll != "undefined" ? e.querySelectorAll("*") : []
    }

    function ht(e) {
        if (e.type === "checkbox" || e.type === "radio") e.defaultChecked = e.checked
    }

    function pt(e) {
        var t = (e.nodeName || "").toLowerCase();
        t === "input" ? ht(e) : t !== "script" && typeof e.getElementsByTagName != "undefined" && s.grep(e.getElementsByTagName("input"), ht)
    }

    function dt(e) {
        var t = n.createElement("div");
        return ut.appendChild(t), t.innerHTML = e.outerHTML, t.firstChild
    }

    function kt(e, t, n) {
        var r = t === "width" ? e.offsetWidth : e.offsetHeight,
            i = t === "width" ? 1 : 0,
            o = 4;
        if (r > 0) {
            if (n !== "border")
                for (; i < o; i += 2) n || (r -= parseFloat(s.css(e, "padding" + xt[i])) || 0), n === "margin" ? r += parseFloat(s.css(e, n + xt[i])) || 0 : r -= parseFloat(s.css(e, "border" + xt[i] + "Width")) || 0;
            return r + "px"
        }
        r = Tt(e, t);
        if (r < 0 || r == null) r = e.style[t];
        if (bt.test(r)) return r;
        r = parseFloat(r) || 0;
        if (n)
            for (; i < o; i += 2) r += parseFloat(s.css(e, "padding" + xt[i])) || 0, n !== "padding" && (r += parseFloat(s.css(e, "border" + xt[i] + "Width")) || 0), n === "margin" && (r += parseFloat(s.css(e, n + xt[i])) || 0);
        return r + "px"
    }

    function Qt(e) {
        return function(t, n) {
            typeof t != "string" && (n = t, t = "*");
            if (s.isFunction(n)) {
                var r = t.toLowerCase().split(qt),
                    i = 0,
                    o = r.length,
                    u, a, f;
                for (; i < o; i++) u = r[i], f = /^\+/.test(u), f && (u = u.substr(1) || "*"), a = e[u] = e[u] || [], a[f ? "unshift" : "push"](n)
            }
        }
    }

    function Gt(e, n, r, i, s, o) {
        s = s || n.dataTypes[0], o = o || {}, o[s] = !0;
        var u = e[s],
            a = 0,
            f = u ? u.length : 0,
            l = e === Wt,
            c;
        for (; a < f && (l || !c); a++) c = u[a](n, r, i), typeof c == "string" && (!l || o[c] ? c = t : (n.dataTypes.unshift(c), c = Gt(e, n, r, i, c, o)));
        return (l || !c) && !o["*"] && (c = Gt(e, n, r, i, "*", o)), c
    }

    function Yt(e, n) {
        var r, i, o = s.ajaxSettings.flatOptions || {};
        for (r in n) n[r] !== t && ((o[r] ? e : i || (i = {}))[r] = n[r]);
        i && s.extend(!0, e, i)
    }

    function Zt(e, t, n, r) {
        if (s.isArray(t)) s.each(t, function(t, i) {
            n || At.test(e) ? r(e, i) : Zt(e + "[" + (typeof i == "object" ? t : "") + "]", i, n, r)
        });
        else if (!n && s.type(t) === "object")
            for (var i in t) Zt(e + "[" + i + "]", t[i], n, r);
        else r(e, t)
    }

    function en(e, n, r) {
        var i = e.contents,
            s = e.dataTypes,
            o = e.responseFields,
            u, a, f, l;
        for (a in o) a in r && (n[o[a]] = r[a]);
        while (s[0] === "*") s.shift(), u === t && (u = e.mimeType || n.getResponseHeader("content-type"));
        if (u)
            for (a in i)
                if (i[a] && i[a].test(u)) {
                    s.unshift(a);
                    break
                }
        if (s[0] in r) f = s[0];
        else {
            for (a in r) {
                if (!s[0] || e.converters[a + " " + s[0]]) {
                    f = a;
                    break
                }
                l || (l = a)
            }
            f = f || l
        } if (f) return f !== s[0] && s.unshift(f), r[f]
    }

    function tn(e, n) {
        e.dataFilter && (n = e.dataFilter(n, e.dataType));
        var r = e.dataTypes,
            i = {},
            o, u, a = r.length,
            f, l = r[0],
            c, h, p, d, v;
        for (o = 1; o < a; o++) {
            if (o === 1)
                for (u in e.converters) typeof u == "string" && (i[u.toLowerCase()] = e.converters[u]);
            c = l, l = r[o];
            if (l === "*") l = c;
            else if (c !== "*" && c !== l) {
                h = c + " " + l, p = i[h] || i["* " + l];
                if (!p) {
                    v = t;
                    for (d in i) {
                        f = d.split(" ");
                        if (f[0] === c || f[0] === "*") {
                            v = i[f[1] + " " + l];
                            if (v) {
                                d = i[d], d === !0 ? p = v : v === !0 && (p = d);
                                break
                            }
                        }
                    }
                }!p && !v && s.error("No conversion from " + h.replace(" ", " to ")), p !== !0 && (n = p ? p(n) : v(d(n)))
            }
        }
        return n
    }

    function an() {
        try {
            return new e.XMLHttpRequest
        } catch (t) {}
    }

    function fn() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {}
    }

    function yn() {
        return setTimeout(bn, 0), gn = s.now()
    }

    function bn() {
        gn = t
    }

    function wn(e, t) {
        var n = {};
        return s.each(mn.concat.apply([], mn.slice(0, t)), function() {
            n[this] = e
        }), n
    }

    function En(e) {
        if (!ln[e]) {
            var t = n.body,
                r = s("<" + e + ">").appendTo(t),
                i = r.css("display");
            r.remove();
            if (i === "none" || i === "") {
                cn || (cn = n.createElement("iframe"), cn.frameBorder = cn.width = cn.height = 0), t.appendChild(cn);
                if (!hn || !cn.createElement) hn = (cn.contentWindow || cn.contentDocument).document, hn.write((s.support.boxModel ? "<!doctype html>" : "") + "<html><body>"), hn.close();
                r = hn.createElement(e), hn.body.appendChild(r), i = s.css(r, "display"), t.removeChild(cn)
            }
            ln[e] = i
        }
        return ln[e]
    }

    function Nn(e) {
        return s.isWindow(e) ? e : e.nodeType === 9 ? e.defaultView || e.parentWindow : !1
    }
    var n = e.document,
        r = e.navigator,
        i = e.location,
        s = function() {
            function H() {
                if (i.isReady) return;
                try {
                    n.documentElement.doScroll("left")
                } catch (e) {
                    setTimeout(H, 1);
                    return
                }
                i.ready()
            }
            var i = function(e, t) {
                    return new i.fn.init(e, t, u)
                },
                s = e.jQuery,
                o = e.$,
                u, a = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
                f = /\S/,
                l = /^\s+/,
                c = /\s+$/,
                h = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
                p = /^[\],:{}\s]*$/,
                d = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                v = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                m = /(?:^|:|,)(?:\s*\[)+/g,
                g = /(webkit)[ \/]([\w.]+)/,
                y = /(opera)(?:.*version)?[ \/]([\w.]+)/,
                b = /(msie) ([\w.]+)/,
                w = /(mozilla)(?:.*? rv:([\w.]+))?/,
                E = /-([a-z]|[0-9])/ig,
                S = /^-ms-/,
                x = function(e, t) {
                    return (t + "").toUpperCase()
                },
                T = r.userAgent,
                N, C, k, L = Object.prototype.toString,
                A = Object.prototype.hasOwnProperty,
                O = Array.prototype.push,
                M = Array.prototype.slice,
                _ = String.prototype.trim,
                D = Array.prototype.indexOf,
                P = {};
            return i.fn = i.prototype = {
                constructor: i,
                init: function(e, r, s) {
                    var o, u, f, l;
                    if (!e) return this;
                    if (e.nodeType) return this.context = this[0] = e, this.length = 1, this;
                    if (e === "body" && !r && n.body) return this.context = n, this[0] = n.body, this.selector = e, this.length = 1, this;
                    if (typeof e == "string") {
                        e.charAt(0) === "<" && e.charAt(e.length - 1) === ">" && e.length >= 3 ? o = [null, e, null] : o = a.exec(e);
                        if (o && (o[1] || !r)) {
                            if (o[1]) return r = r instanceof i ? r[0] : r, l = r ? r.ownerDocument || r : n, f = h.exec(e), f ? i.isPlainObject(r) ? (e = [n.createElement(f[1])], i.fn.attr.call(e, r, !0)) : e = [l.createElement(f[1])] : (f = i.buildFragment([o[1]], [l]), e = (f.cacheable ? i.clone(f.fragment) : f.fragment).childNodes), i.merge(this, e);
                            u = n.getElementById(o[2]);
                            if (u && u.parentNode) {
                                if (u.id !== o[2]) return s.find(e);
                                this.length = 1, this[0] = u
                            }
                            return this.context = n, this.selector = e, this
                        }
                        return !r || r.jquery ? (r || s).find(e) : this.constructor(r).find(e)
                    }
                    return i.isFunction(e) ? s.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), i.makeArray(e, this))
                },
                selector: "",
                jquery: "1.7.2",
                length: 0,
                size: function() {
                    return this.length
                },
                toArray: function() {
                    return M.call(this, 0)
                },
                get: function(e) {
                    return e == null ? this.toArray() : e < 0 ? this[this.length + e] : this[e]
                },
                pushStack: function(e, t, n) {
                    var r = this.constructor();
                    return i.isArray(e) ? O.apply(r, e) : i.merge(r, e), r.prevObject = this, r.context = this.context, t === "find" ? r.selector = this.selector + (this.selector ? " " : "") + n : t && (r.selector = this.selector + "." + t + "(" + n + ")"), r
                },
                each: function(e, t) {
                    return i.each(this, e, t)
                },
                ready: function(e) {
                    return i.bindReady(), C.add(e), this
                },
                eq: function(e) {
                    return e = +e, e === -1 ? this.slice(e) : this.slice(e, e + 1)
                },
                first: function() {
                    return this.eq(0)
                },
                last: function() {
                    return this.eq(-1)
                },
                slice: function() {
                    return this.pushStack(M.apply(this, arguments), "slice", M.call(arguments).join(","))
                },
                map: function(e) {
                    return this.pushStack(i.map(this, function(t, n) {
                        return e.call(t, n, t)
                    }))
                },
                end: function() {
                    return this.prevObject || this.constructor(null)
                },
                push: O,
                sort: [].sort,
                splice: [].splice
            }, i.fn.init.prototype = i.fn, i.extend = i.fn.extend = function() {
                var e, n, r, s, o, u, a = arguments[0] || {},
                    f = 1,
                    l = arguments.length,
                    c = !1;
                typeof a == "boolean" && (c = a, a = arguments[1] || {}, f = 2), typeof a != "object" && !i.isFunction(a) && (a = {}), l === f && (a = this, --f);
                for (; f < l; f++)
                    if ((e = arguments[f]) != null)
                        for (n in e) {
                            r = a[n], s = e[n];
                            if (a === s) continue;
                            c && s && (i.isPlainObject(s) || (o = i.isArray(s))) ? (o ? (o = !1, u = r && i.isArray(r) ? r : []) : u = r && i.isPlainObject(r) ? r : {}, a[n] = i.extend(c, u, s)) : s !== t && (a[n] = s)
                        }
                    return a
            }, i.extend({
                noConflict: function(t) {
                    return e.$ === i && (e.$ = o), t && e.jQuery === i && (e.jQuery = s), i
                },
                isReady: !1,
                readyWait: 1,
                holdReady: function(e) {
                    e ? i.readyWait++ : i.ready(!0)
                },
                ready: function(e) {
                    if (e === !0 && !--i.readyWait || e !== !0 && !i.isReady) {
                        if (!n.body) return setTimeout(i.ready, 1);
                        i.isReady = !0;
                        if (e !== !0 && --i.readyWait > 0) return;
                        C.fireWith(n, [i]), i.fn.trigger && i(n).trigger("ready").off("ready")
                    }
                },
                bindReady: function() {
                    if (C) return;
                    C = i.Callbacks("once memory");
                    if (n.readyState === "complete") return setTimeout(i.ready, 1);
                    if (n.addEventListener) n.addEventListener("DOMContentLoaded", k, !1), e.addEventListener("load", i.ready, !1);
                    else if (n.attachEvent) {
                        n.attachEvent("onreadystatechange", k), e.attachEvent("onload", i.ready);
                        var t = !1;
                        try {
                            t = e.frameElement == null
                        } catch (r) {}
                        n.documentElement.doScroll && t && H()
                    }
                },
                isFunction: function(e) {
                    return i.type(e) === "function"
                },
                isArray: Array.isArray || function(e) {
                    return i.type(e) === "array"
                },
                isWindow: function(e) {
                    return e != null && e == e.window
                },
                isNumeric: function(e) {
                    return !isNaN(parseFloat(e)) && isFinite(e)
                },
                type: function(e) {
                    return e == null ? String(e) : P[L.call(e)] || "object"
                },
                isPlainObject: function(e) {
                    if (!e || i.type(e) !== "object" || e.nodeType || i.isWindow(e)) return !1;
                    try {
                        if (e.constructor && !A.call(e, "constructor") && !A.call(e.constructor.prototype, "isPrototypeOf")) return !1
                    } catch (n) {
                        return !1
                    }
                    var r;
                    for (r in e);
                    return r === t || A.call(e, r)
                },
                isEmptyObject: function(e) {
                    for (var t in e) return !1;
                    return !0
                },
                error: function(e) {
                    throw new Error(e)
                },
                parseJSON: function(t) {
                    if (typeof t != "string" || !t) return null;
                    t = i.trim(t);
                    if (e.JSON && e.JSON.parse) return e.JSON.parse(t);
                    if (p.test(t.replace(d, "@").replace(v, "]").replace(m, ""))) return (new Function("return " + t))();
                    i.error("Invalid JSON: " + t)
                },
                parseXML: function(n) {
                    if (typeof n != "string" || !n) return null;
                    var r, s;
                    try {
                        e.DOMParser ? (s = new DOMParser, r = s.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n))
                    } catch (o) {
                        r = t
                    }
                    return (!r || !r.documentElement || r.getElementsByTagName("parsererror").length) && i.error("Invalid XML: " + n), r
                },
                noop: function() {},
                globalEval: function(t) {
                    t && f.test(t) && (e.execScript || function(t) {
                        e.eval.call(e, t)
                    })(t)
                },
                camelCase: function(e) {
                    return e.replace(S, "ms-").replace(E, x)
                },
                nodeName: function(e, t) {
                    return e.nodeName && e.nodeName.toUpperCase() === t.toUpperCase()
                },
                each: function(e, n, r) {
                    var s, o = 0,
                        u = e.length,
                        a = u === t || i.isFunction(e);
                    if (r) {
                        if (a) {
                            for (s in e)
                                if (n.apply(e[s], r) === !1) break
                        } else
                            for (; o < u;)
                                if (n.apply(e[o++], r) === !1) break
                    } else if (a) {
                        for (s in e)
                            if (n.call(e[s], s, e[s]) === !1) break
                    } else
                        for (; o < u;)
                            if (n.call(e[o], o, e[o++]) === !1) break; return e
                },
                trim: _ ? function(e) {
                    return e == null ? "" : _.call(e)
                } : function(e) {
                    return e == null ? "" : e.toString().replace(l, "").replace(c, "")
                },
                makeArray: function(e, t) {
                    var n = t || [];
                    if (e != null) {
                        var r = i.type(e);
                        e.length == null || r === "string" || r === "function" || r === "regexp" || i.isWindow(e) ? O.call(n, e) : i.merge(n, e)
                    }
                    return n
                },
                inArray: function(e, t, n) {
                    var r;
                    if (t) {
                        if (D) return D.call(t, e, n);
                        r = t.length, n = n ? n < 0 ? Math.max(0, r + n) : n : 0;
                        for (; n < r; n++)
                            if (n in t && t[n] === e) return n
                    }
                    return -1
                },
                merge: function(e, n) {
                    var r = e.length,
                        i = 0;
                    if (typeof n.length == "number")
                        for (var s = n.length; i < s; i++) e[r++] = n[i];
                    else
                        while (n[i] !== t) e[r++] = n[i++];
                    return e.length = r, e
                },
                grep: function(e, t, n) {
                    var r = [],
                        i;
                    n = !!n;
                    for (var s = 0, o = e.length; s < o; s++) i = !!t(e[s], s), n !== i && r.push(e[s]);
                    return r
                },
                map: function(e, n, r) {
                    var s, o, u = [],
                        a = 0,
                        f = e.length,
                        l = e instanceof i || f !== t && typeof f == "number" && (f > 0 && e[0] && e[f - 1] || f === 0 || i.isArray(e));
                    if (l)
                        for (; a < f; a++) s = n(e[a], a, r), s != null && (u[u.length] = s);
                    else
                        for (o in e) s = n(e[o], o, r), s != null && (u[u.length] = s);
                    return u.concat.apply([], u)
                },
                guid: 1,
                proxy: function(e, n) {
                    if (typeof n == "string") {
                        var r = e[n];
                        n = e, e = r
                    }
                    if (!i.isFunction(e)) return t;
                    var s = M.call(arguments, 2),
                        o = function() {
                            return e.apply(n, s.concat(M.call(arguments)))
                        };
                    return o.guid = e.guid = e.guid || o.guid || i.guid++, o
                },
                access: function(e, n, r, s, o, u, a) {
                    var f, l = r == null,
                        c = 0,
                        h = e.length;
                    if (r && typeof r == "object") {
                        for (c in r) i.access(e, n, c, r[c], 1, u, s);
                        o = 1
                    } else if (s !== t) {
                        f = a === t && i.isFunction(s), l && (f ? (f = n, n = function(e, t, n) {
                            return f.call(i(e), n)
                        }) : (n.call(e, s), n = null));
                        if (n)
                            for (; c < h; c++) n(e[c], r, f ? s.call(e[c], c, n(e[c], r)) : s, a);
                        o = 1
                    }
                    return o ? e : l ? n.call(e) : h ? n(e[0], r) : u
                },
                now: function() {
                    return (new Date).getTime()
                },
                uaMatch: function(e) {
                    e = e.toLowerCase();
                    var t = g.exec(e) || y.exec(e) || b.exec(e) || e.indexOf("compatible") < 0 && w.exec(e) || [];
                    return {
                        browser: t[1] || "",
                        version: t[2] || "0"
                    }
                },
                sub: function() {
                    function e(t, n) {
                        return new e.fn.init(t, n)
                    }
                    i.extend(!0, e, this), e.superclass = this, e.fn = e.prototype = this(), e
                        .fn.constructor = e, e.sub = this.sub, e.fn.init = function(r, s) {
                            return s && s instanceof i && !(s instanceof e) && (s = e(s)), i.fn.init.call(this, r, s, t)
                    }, e.fn.init.prototype = e.fn;
                    var t = e(n);
                    return e
                },
                browser: {}
            }), i.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(e, t) {
                P["[object " + t + "]"] = t.toLowerCase()
            }), N = i.uaMatch(T), N.browser && (i.browser[N.browser] = !0, i.browser.version = N.version), i.browser.webkit && (i.browser.safari = !0), f.test(" ") && (l = /^[\s\xA0]+/, c = /[\s\xA0]+$/), u = i(n), n.addEventListener ? k = function() {
                n.removeEventListener("DOMContentLoaded", k, !1), i.ready()
            } : n.attachEvent && (k = function() {
                n.readyState === "complete" && (n.detachEvent("onreadystatechange", k), i.ready())
            }), i
        }(),
        o = {};
    s.Callbacks = function(e) {
        e = e ? o[e] || u(e) : {};
        var n = [],
            r = [],
            i, a, f, l, c, h, p = function(t) {
                var r, i, o, u, a;
                for (r = 0, i = t.length; r < i; r++) o = t[r], u = s.type(o), u === "array" ? p(o) : u === "function" && (!e.unique || !v.has(o)) && n.push(o)
            },
            d = function(t, s) {
                s = s || [], i = !e.memory || [t, s], a = !0, f = !0, h = l || 0, l = 0, c = n.length;
                for (; n && h < c; h++)
                    if (n[h].apply(t, s) === !1 && e.stopOnFalse) {
                        i = !0;
                        break
                    }
                f = !1, n && (e.once ? i === !0 ? v.disable() : n = [] : r && r.length && (i = r.shift(), v.fireWith(i[0], i[1])))
            },
            v = {
                add: function() {
                    if (n) {
                        var e = n.length;
                        p(arguments), f ? c = n.length : i && i !== !0 && (l = e, d(i[0], i[1]))
                    }
                    return this
                },
                remove: function() {
                    if (n) {
                        var t = arguments,
                            r = 0,
                            i = t.length;
                        for (; r < i; r++)
                            for (var s = 0; s < n.length; s++)
                                if (t[r] === n[s]) {
                                    f && s <= c && (c--, s <= h && h--), n.splice(s--, 1);
                                    if (e.unique) break
                                }
                    }
                    return this
                },
                has: function(e) {
                    if (n) {
                        var t = 0,
                            r = n.length;
                        for (; t < r; t++)
                            if (e === n[t]) return !0
                    }
                    return !1
                },
                empty: function() {
                    return n = [], this
                },
                disable: function() {
                    return n = r = i = t, this
                },
                disabled: function() {
                    return !n
                },
                lock: function() {
                    return r = t, (!i || i === !0) && v.disable(), this
                },
                locked: function() {
                    return !r
                },
                fireWith: function(t, n) {
                    return r && (f ? e.once || r.push([t, n]) : (!e.once || !i) && d(t, n)), this
                },
                fire: function() {
                    return v.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!a
                }
            };
        return v
    };
    var a = [].slice;
    s.extend({
        Deferred: function(e) {
            var t = s.Callbacks("once memory"),
                n = s.Callbacks("once memory"),
                r = s.Callbacks("memory"),
                i = "pending",
                o = {
                    resolve: t,
                    reject: n,
                    notify: r
                },
                u = {
                    done: t.add,
                    fail: n.add,
                    progress: r.add,
                    state: function() {
                        return i
                    },
                    isResolved: t.fired,
                    isRejected: n.fired,
                    then: function(e, t, n) {
                        return a.done(e).fail(t).progress(n), this
                    },
                    always: function() {
                        return a.done.apply(a, arguments).fail.apply(a, arguments), this
                    },
                    pipe: function(e, t, n) {
                        return s.Deferred(function(r) {
                            s.each({
                                done: [e, "resolve"],
                                fail: [t, "reject"],
                                progress: [n, "notify"]
                            }, function(e, t) {
                                var n = t[0],
                                    i = t[1],
                                    o;
                                s.isFunction(n) ? a[e](function() {
                                    o = n.apply(this, arguments), o && s.isFunction(o.promise) ? o.promise().then(r.resolve, r.reject, r.notify) : r[i + "With"](this === a ? r : this, [o])
                                }) : a[e](r[i])
                            })
                        }).promise()
                    },
                    promise: function(e) {
                        if (e == null) e = u;
                        else
                            for (var t in u) e[t] = u[t];
                        return e
                    }
                },
                a = u.promise({}),
                f;
            for (f in o) a[f] = o[f].fire, a[f + "With"] = o[f].fireWith;
            return a.done(function() {
                i = "resolved"
            }, n.disable, r.lock).fail(function() {
                i = "rejected"
            }, t.disable, r.lock), e && e.call(a, a), a
        },
        when: function(e) {
            function c(e) {
                return function(n) {
                    t[e] = arguments.length > 1 ? a.call(arguments, 0) : n, --o || f.resolveWith(f, t)
                }
            }

            function h(e) {
                return function(t) {
                    i[e] = arguments.length > 1 ? a.call(arguments, 0) : t, f.notifyWith(l, i)
                }
            }
            var t = a.call(arguments, 0),
                n = 0,
                r = t.length,
                i = new Array(r),
                o = r,
                u = r,
                f = r <= 1 && e && s.isFunction(e.promise) ? e : s.Deferred(),
                l = f.promise();
            if (r > 1) {
                for (; n < r; n++) t[n] && t[n].promise && s.isFunction(t[n].promise) ? t[n].promise().then(c(n), f.reject, h(n)) : --o;
                o || f.resolveWith(f, t)
            } else f !== e && f.resolveWith(f, r ? [e] : []);
            return l
        }
    }), s.support = function() {
        var t, r, i, o, u, a, f, l, c, h, p, d, v = n.createElement("div"),
            m = n.documentElement;
        v.setAttribute("className", "t"), v.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>", r = v.getElementsByTagName("*"), i = v.getElementsByTagName("a")[0];
        if (!r || !r.length || !i) return {};
        o = n.createElement("select"), u = o.appendChild(n.createElement("option")), a = v.getElementsByTagName("input")[0], t = {
            leadingWhitespace: v.firstChild.nodeType === 3,
            tbody: !v.getElementsByTagName("tbody").length,
            htmlSerialize: !!v.getElementsByTagName("link").length,
            style: /top/.test(i.getAttribute("style")),
            hrefNormalized: i.getAttribute("href") === "/a",
            opacity: /^0.55/.test(i.style.opacity),
            cssFloat: !!i.style.cssFloat,
            checkOn: a.value === "on",
            optSelected: u.selected,
            getSetAttribute: v.className !== "t",
            enctype: !!n.createElement("form").enctype,
            html5Clone: n.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
            submitBubbles: !0,
            changeBubbles: !0,
            focusinBubbles: !1,
            deleteExpando: !0,
            noCloneEvent: !0,
            inlineBlockNeedsLayout: !1,
            shrinkWrapBlocks: !1,
            reliableMarginRight: !0,
            pixelMargin: !0
        }, s.boxModel = t.boxModel = n.compatMode === "CSS1Compat", a.checked = !0, t.noCloneChecked = a.cloneNode(!0).checked, o.disabled = !0, t.optDisabled = !u.disabled;
        try {
            delete v.test
        } catch (g) {
            t.deleteExpando = !1
        }!v.addEventListener && v.attachEvent && v.fireEvent && (v.attachEvent("onclick", function() {
            t.noCloneEvent = !1
        }), v.cloneNode(!0).fireEvent("onclick")), a = n.createElement("input"), a.value = "t", a.setAttribute("type", "radio"), t.radioValue = a.value === "t", a.setAttribute("checked", "checked"), a.setAttribute("name", "t"), v.appendChild(a), f = n.createDocumentFragment(), f.appendChild(v.lastChild), t.checkClone = f.cloneNode(!0).cloneNode(!0).lastChild.checked, t.appendChecked = a.checked, f.removeChild(a), f.appendChild(v);
        if (v.attachEvent)
            for (p in {
                submit: 1,
                change: 1,
                focusin: 1
            }) h = "on" + p, d = h in v, d || (v.setAttribute(h, "return;"), d = typeof v[h] == "function"), t[p + "Bubbles"] = d;
        return f.removeChild(v), f = o = u = v = a = null, s(function() {
            var r, i, o, u, a, f, c, h, p, m, g, y, b, w = n.getElementsByTagName("body")[0];
            if (!w) return;
            h = 1, b = "padding:0;margin:0;border:", g = "position:absolute;top:0;left:0;width:1px;height:1px;", y = b + "0;visibility:hidden;", p = "style='" + g + b + "5px solid #000;", m = "<div " + p + "display:block;'><div style='" + b + "0;display:block;overflow:hidden;'></div></div>" + "<table " + p + "' cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>", r = n.createElement("div"), r.style.cssText = y + "width:0;height:0;position:static;top:0;margin-top:" + h + "px", w.insertBefore(r, w.firstChild), v = n.createElement("div"), r.appendChild(v), v.innerHTML = "<table><tr><td style='" + b + "0;display:none'></td><td>t</td></tr></table>", l = v.getElementsByTagName("td"), d = l[0].offsetHeight === 0, l[0].style.display = "", l[1].style.display = "none", t.reliableHiddenOffsets = d && l[0].offsetHeight === 0, e.getComputedStyle && (v.innerHTML = "", c = n.createElement("div"), c.style.width = "0", c.style.marginRight = "0", v.style.width = "2px", v.appendChild(c), t.reliableMarginRight = (parseInt((e.getComputedStyle(c, null) || {
                marginRight: 0
            }).marginRight, 10) || 0) === 0), typeof v.style.zoom != "undefined" && (v.innerHTML = "", v.style.width = v.style.padding = "1px", v.style.border = 0, v.style.overflow = "hidden", v.style.display = "inline", v.style.zoom = 1, t.inlineBlockNeedsLayout = v.offsetWidth === 3, v.style.display = "block", v.style.overflow = "visible", v.innerHTML = "<div style='width:5px;'></div>", t.shrinkWrapBlocks = v.offsetWidth !== 3), v.style.cssText = g + y, v.innerHTML = m, i = v.firstChild, o = i.firstChild, a = i.nextSibling.firstChild.firstChild, f = {
                doesNotAddBorder: o.offsetTop !== 5,
                doesAddBorderForTableAndCells: a.offsetTop === 5
            }, o.style.position = "fixed", o.style.top = "20px", f.fixedPosition = o.offsetTop === 20 || o.offsetTop === 15, o.style.position = o.style.top = "", i.style.overflow = "hidden", i.style.position = "relative", f.subtractsBorderForOverflowNotVisible = o.offsetTop === -5, f.doesNotIncludeMarginInBodyOffset = w.offsetTop !== h, e.getComputedStyle && (v.style.marginTop = "1%", t.pixelMargin = (e.getComputedStyle(v, null) || {
                marginTop: 0
            }).marginTop !== "1%"), typeof r.style.zoom != "undefined" && (r.style.zoom = 1), w.removeChild(r), c = v = r = null, s.extend(t, f)
        }), t
    }();
    var f = /^(?:\{.*\}|\[.*\])$/,
        l = /([A-Z])/g;
    s.extend({
        cache: {},
        uuid: 0,
        expando: "jQuery" + (s.fn.jquery + Math.random()).replace(/\D/g, ""),
        noData: {
            embed: !0,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: !0
        },
        hasData: function(e) {
            return e = e.nodeType ? s.cache[e[s.expando]] : e[s.expando], !!e && !h(e)
        },
        data: function(e, n, r, i) {
            if (!s.acceptData(e)) return;
            var o, u, a, f = s.expando,
                l = typeof n == "string",
                c = e.nodeType,
                h = c ? s.cache : e,
                p = c ? e[f] : e[f] && f,
                d = n === "events";
            if ((!p || !h[p] || !d && !i && !h[p].data) && l && r === t) return;
            p || (c ? e[f] = p = ++s.uuid : p = f), h[p] || (h[p] = {}, c || (h[p].toJSON = s.noop));
            if (typeof n == "object" || typeof n == "function") i ? h[p] = s.extend(h[p], n) : h[p].data = s.extend(h[p].data, n);
            return o = u = h[p], i || (u.data || (u.data = {}), u = u.data), r !== t && (u[s.camelCase(n)] = r), d && !u[n] ? o.events : (l ? (a = u[n], a == null && (a = u[s.camelCase(n)])) : a = u, a)
        },
        removeData: function(e, t, n) {
            if (!s.acceptData(e)) return;
            var r, i, o, u = s.expando,
                a = e.nodeType,
                f = a ? s.cache : e,
                l = a ? e[u] : u;
            if (!f[l]) return;
            if (t) {
                r = n ? f[l] : f[l].data;
                if (r) {
                    s.isArray(t) || (t in r ? t = [t] : (t = s.camelCase(t), t in r ? t = [t] : t = t.split(" ")));
                    for (i = 0, o = t.length; i < o; i++) delete r[t[i]];
                    if (!(n ? h : s.isEmptyObject)(r)) return
                }
            }
            if (!n) {
                delete f[l].data;
                if (!h(f[l])) return
            }
            s.support.deleteExpando || !f.setInterval ? delete f[l] : f[l] = null, a && (s.support.deleteExpando ? delete e[u] : e.removeAttribute ? e.removeAttribute(u) : e[u] = null)
        },
        _data: function(e, t, n) {
            return s.data(e, t, n, !0)
        },
        acceptData: function(e) {
            if (e.nodeName) {
                var t = s.noData[e.nodeName.toLowerCase()];
                if (t) return t !== !0 && e.getAttribute("classid") === t
            }
            return !0
        }
    }), s.fn.extend({
        data: function(e, n) {
            var r, i, o, u, a, f = this[0],
                l = 0,
                h = null;
            if (e === t) {
                if (this.length) {
                    h = s.data(f);
                    if (f.nodeType === 1 && !s._data(f, "parsedAttrs")) {
                        o = f.attributes;
                        for (a = o.length; l < a; l++) u = o[l].name, u.indexOf("data-") === 0 && (u = s.camelCase(u.substring(5)), c(f, u, h[u]));
                        s._data(f, "parsedAttrs", !0)
                    }
                }
                return h
            }
            return typeof e == "object" ? this.each(function() {
                s.data(this, e)
            }) : (r = e.split(".", 2), r[1] = r[1] ? "." + r[1] : "", i = r[1] + "!", s.access(this, function(n) {
                if (n === t) return h = this.triggerHandler("getData" + i, [r[0]]), h === t && f && (h = s.data(f, e), h = c(f, e, h)), h === t && r[1] ? this.data(r[0]) : h;
                r[1] = n, this.each(function() {
                    var t = s(this);
                    t.triggerHandler("setData" + i, r), s.data(this, e, n), t.triggerHandler("changeData" + i, r)
                })
            }, null, n, arguments.length > 1, null, !1))
        },
        removeData: function(e) {
            return this.each(function() {
                s.removeData(this, e)
            })
        }
    }), s.extend({
        _mark: function(e, t) {
            e && (t = (t || "fx") + "mark", s._data(e, t, (s._data(e, t) || 0) + 1))
        },
        _unmark: function(e, t, n) {
            e !== !0 && (n = t, t = e, e = !1);
            if (t) {
                n = n || "fx";
                var r = n + "mark",
                    i = e ? 0 : (s._data(t, r) || 1) - 1;
                i ? s._data(t, r, i) : (s.removeData(t, r, !0), p(t, n, "mark"))
            }
        },
        queue: function(e, t, n) {
            var r;
            if (e) return t = (t || "fx") + "queue", r = s._data(e, t), n && (!r || s.isArray(n) ? r = s._data(e, t, s.makeArray(n)) : r.push(n)), r || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = s.queue(e, t),
                r = n.shift(),
                i = {};
            r === "inprogress" && (r = n.shift()), r && (t === "fx" && n.unshift("inprogress"), s._data(e, t + ".run", i), r.call(e, function() {
                s.dequeue(e, t)
            }, i)), n.length || (s.removeData(e, t + "queue " + t + ".run", !0), p(e, t, "queue"))
        }
    }), s.fn.extend({
        queue: function(e, n) {
            var r = 2;
            return typeof e != "string" && (n = e, e = "fx", r--), arguments.length < r ? s.queue(this[0], e) : n === t ? this : this.each(function() {
                var t = s.queue(this, e, n);
                e === "fx" && t[0] !== "inprogress" && s.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                s.dequeue(this, e)
            })
        },
        delay: function(e, t) {
            return e = s.fx ? s.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
                var r = setTimeout(t, e);
                n.stop = function() {
                    clearTimeout(r)
                }
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, n) {
            function h() {
                --u || r.resolveWith(i, [i])
            }
            typeof e != "string" && (n = e, e = t), e = e || "fx";
            var r = s.Deferred(),
                i = this,
                o = i.length,
                u = 1,
                a = e + "defer",
                f = e + "queue",
                l = e + "mark",
                c;
            while (o--)
                if (c = s.data(i[o], a, t, !0) || (s.data(i[o], f, t, !0) || s.data(i[o], l, t, !0)) && s.data(i[o], a, s.Callbacks("once memory"), !0)) u++, c.add(h);
            return h(), r.promise(n)
        }
    });
    var d = /[\n\t\r]/g,
        v = /\s+/,
        m = /\r/g,
        g = /^(?:button|input)$/i,
        y = /^(?:button|input|object|select|textarea)$/i,
        b = /^a(?:rea)?$/i,
        w = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        E = s.support.getSetAttribute,
        S, x, T;
    s.fn.extend({
        attr: function(e, t) {
            return s.access(this, s.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                s.removeAttr(this, e)
            })
        },
        prop: function(e, t) {
            return s.access(this, s.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return e = s.propFix[e] || e, this.each(function() {
                try {
                    this[e] = t, delete this[e]
                } catch (n) {}
            })
        },
        addClass: function(e) {
            var t, n, r, i, o, u, a;
            if (s.isFunction(e)) return this.each(function(t) {
                s(this).addClass(e.call(this, t, this.className))
            });
            if (e && typeof e == "string") {
                t = e.split(v);
                for (n = 0, r = this.length; n < r; n++) {
                    i = this[n];
                    if (i.nodeType === 1)
                        if (!i.className && t.length === 1) i.className = e;
                        else {
                            o = " " + i.className + " ";
                            for (u = 0, a = t.length; u < a; u++)~ o.indexOf(" " + t[u] + " ") || (o += t[u] + " ");
                            i.className = s.trim(o)
                        }
                }
            }
            return this
        },
        removeClass: function(e) {
            var n, r, i, o, u, a, f;
            if (s.isFunction(e)) return this.each(function(t) {
                s(this).removeClass(e.call(this, t, this.className))
            });
            if (e && typeof e == "string" || e === t) {
                n = (e || "").split(v);
                for (r = 0, i = this.length; r < i; r++) {
                    o = this[r];
                    if (o.nodeType === 1 && o.className)
                        if (e) {
                            u = (" " + o.className + " ").replace(d, " ");
                            for (a = 0, f = n.length; a < f; a++) u = u.replace(" " + n[a] + " ", " ");
                            o.className = s.trim(u)
                        } else o.className = ""
                }
            }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e,
                r = typeof t == "boolean";
            return s.isFunction(e) ? this.each(function(n) {
                s(this).toggleClass(e.call(this, n, this.className, t), t)
            }) : this.each(function() {
                if (n === "string") {
                    var i, o = 0,
                        u = s(this),
                        a = t,
                        f = e.split(v);
                    while (i = f[o++]) a = r ? a : !u.hasClass(i), u[a ? "addClass" : "removeClass"](i)
                } else if (n === "undefined" || n === "boolean") this.className && s._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : s._data(this, "__className__") || ""
            })
        },
        hasClass: function(e) {
            var t = " " + e + " ",
                n = 0,
                r = this.length;
            for (; n < r; n++)
                if (this[n].nodeType === 1 && (" " + this[n].className + " ").replace(d, " ").indexOf(t) > -1) return !0;
            return !1
        },
        val: function(e) {
            var n, r, i, o = this[0];
            if (!arguments.length) {
                if (o) return n = s.valHooks[o.type] || s.valHooks[o.nodeName.toLowerCase()], n && "get" in n && (r = n.get(o, "value")) !== t ? r : (r = o.value, typeof r == "string" ? r.replace(m, "") : r == null ? "" : r);
                return
            }
            return i = s.isFunction(e), this.each(function(r) {
                var o = s(this),
                    u;
                if (this.nodeType !== 1) return;
                i ? u = e.call(this, r, o.val()) : u = e, u == null ? u = "" : typeof u == "number" ? u += "" : s.isArray(u) && (u = s.map(u, function(e) {
                    return e == null ? "" : e + ""
                })), n = s.valHooks[this.type] || s.valHooks[this.nodeName.toLowerCase()];
                if (!n || !("set" in n) || n.set(this, u, "value") === t) this.value = u
            })
        }
    }), s.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = e.attributes.value;
                    return !t || t.specified ? e.value : e.text
                }
            },
            select: {
                get: function(e) {
                    var t, n, r, i, o = e.selectedIndex,
                        u = [],
                        a = e.options,
                        f = e.type === "select-one";
                    if (o < 0) return null;
                    n = f ? o : 0, r = f ? o + 1 : a.length;
                    for (; n < r; n++) {
                        i = a[n];
                        if (i.selected && (s.support.optDisabled ? !i.disabled : i.getAttribute("disabled") === null) && (!i.parentNode.disabled || !s.nodeName(i.parentNode, "optgroup"))) {
                            t = s(i).val();
                            if (f) return t;
                            u.push(t)
                        }
                    }
                    return f && !u.length && a.length ? s(a[o]).val() : u
                },
                set: function(e, t) {
                    var n = s.makeArray(t);
                    return s(e).find("option").each(function() {
                        this.selected = s.inArray(s(this).val(), n) >= 0
                    }), n.length || (e.selectedIndex = -1), n
                }
            }
        },
        attrFn: {
            val: !0,
            css: !0,
            html: !0,
            text: !0,
            data: !0,
            width: !0,
            height: !0,
            offset: !0
        },
        attr: function(e, n, r, i) {
            var o, u, a, f = e.nodeType;
            if (!e || f === 3 || f === 8 || f === 2) return;
            if (i && n in s.attrFn) return s(e)[n](r);
            if (typeof e.getAttribute == "undefined") return s.prop(e, n, r);
            a = f !== 1 || !s.isXMLDoc(e), a && (n = n.toLowerCase(), u = s.attrHooks[n] || (w.test(n) ? x : S));
            if (r !== t) {
                if (r === null) {
                    s.removeAttr(e, n);
                    return
                }
                return u && "set" in u && a && (o = u.set(e, r, n)) !== t ? o : (e.setAttribute(n, "" + r), r)
            }
            return u && "get" in u && a && (o = u.get(e, n)) !== null ? o : (o = e.getAttribute(n), o === null ? t : o)
        },
        removeAttr: function(e, t) {
            var n, r, i, o, u, a = 0;
            if (t && e.nodeType === 1) {
                r = t.toLowerCase().split(v), o = r.length;
                for (; a < o; a++) i = r[a], i && (n = s.propFix[i] || i, u = w.test(i), u || s.attr(e, i, ""), e.removeAttribute(E ? i : n), u && n in e && (e[n] = !1))
            }
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (g.test(e.nodeName) && e.parentNode) s.error("type property can't be changed");
                    else if (!s.support.radioValue && t === "radio" && s.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            },
            value: {
                get: function(e, t) {
                    return S && s.nodeName(e, "button") ? S.get(e, t) : t in e ? e.value : null
                },
                set: function(e, t, n) {
                    if (S && s.nodeName(e, "button")) return S.set(e, t, n);
                    e.value = t
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function(e, n, r) {
            var i, o, u, a = e.nodeType;
            if (!e || a === 3 || a === 8 || a === 2) return;
            return u = a !== 1 || !s.isXMLDoc(e), u && (n = s.propFix[n] || n, o = s.propHooks[n]), r !== t ? o && "set" in o && (i = o.set(e, r, n)) !== t ? i : e[n] = r : o && "get" in o && (i = o.get(e, n)) !== null ? i : e[n]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var n = e.getAttributeNode("tabindex");
                    return n && n.specified ? parseInt(n.value, 10) : y.test(e.nodeName) || b.test(e.nodeName) && e.href ? 0 : t
                }
            }
        }
    }), s.attrHooks.tabindex = s.propHooks.tabIndex, x = {
        get: function(e, n) {
            var r, i = s.prop(e, n);
            return i === !0 || typeof i != "boolean" && (r = e.getAttributeNode(n)) && r.nodeValue !== !1 ? n.toLowerCase() : t
        },
        set: function(e, t, n) {
            var r;
            return t === !1 ? s.removeAttr(e, n) : (r = s.propFix[n] || n, r in e && (e[r] = !0), e.setAttribute(n, n.toLowerCase())), n
        }
    }, E || (T = {
        name: !0,
        id: !0,
        coords: !0
    }, S = s.valHooks.button = {
        get: function(e, n) {
            var r;
            return r = e.getAttributeNode(n), r && (T[n] ? r.nodeValue !== "" : r.specified) ? r.nodeValue : t
        },
        set: function(e, t, r) {
            var i = e.getAttributeNode(r);
            return i || (i = n.createAttribute(r), e.setAttributeNode(i)), i.nodeValue = t + ""
        }
    }, s.attrHooks.tabindex.set = S.set, s.each(["width", "height"], function(e, t) {
        s.attrHooks[t] = s.extend(s.attrHooks[t], {
            set: function(e, n) {
                if (n === "") return e.setAttribute(t, "auto"), n
            }
        })
    }), s.attrHooks.contenteditable = {
        get: S.get,
        set: function(e, t, n) {
            t === "" && (t = "false"), S.set(e, t, n)
        }
    }), s.support.hrefNormalized || s.each(["href", "src", "width", "height"], function(e, n) {
        s.attrHooks[n] = s.extend(s.attrHooks[n], {
            get: function(e) {
                var r = e.getAttribute(n, 2);
                return r === null ? t : r
            }
        })
    }), s.support.style || (s.attrHooks.style = {
        get: function(e) {
            return e.style.cssText.toLowerCase() || t
        },
        set: function(e, t) {
            return e.style.cssText = "" + t
        }
    }), s.support.optSelected || (s.propHooks.selected = s.extend(s.propHooks.selected, {
        get: function(e) {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        }
    })), s.support.enctype || (s.propFix.enctype = "encoding"), s.support.checkOn || s.each(["radio", "checkbox"], function() {
        s.valHooks[this] = {
            get: function(e) {
                return e.getAttribute("value") === null ? "on" : e.value
            }
        }
    }), s.each(["radio", "checkbox"], function() {
        s.valHooks[this] = s.extend(s.valHooks[this], {
            set: function(e, t) {
                if (s.isArray(t)) return e.checked = s.inArray(s(e).val(), t) >= 0
            }
        })
    });
    var N = /^(?:textarea|input|select)$/i,
        C = /^([^\.]*)?(?:\.(.+))?$/,
        k = /(?:^|\s)hover(\.\S+)?\b/,
        L = /^key/,
        A = /^(?:mouse|contextmenu)|click/,
        O = /^(?:focusinfocus|focusoutblur)$/,
        M = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
        _ = function(e) {
            var t = M.exec(e);
            return t && (t[1] = (t[1] || "").toLowerCase(), t[3] = t[3] && new RegExp("(?:^|\\s)" + t[3] + "(?:\\s|$)")), t
        },
        D = function(e, t) {
            var n = e.attributes || {};
            return (!t[1] || e.nodeName.toLowerCase() === t[1]) && (!t[2] || (n.id || {}).value === t[2]) && (!t[3] || t[3].test((n["class"] || {}).value))
        },
        P = function(e) {
            return s.event.special.hover ? e : e.replace(k, "mouseenter$1 mouseleave$1")
        };
    s.event = {
        add: function(e, n, r, i, o) {
            var u, a, f, l, c, h, p, d, v, m, g, y;
            if (e.nodeType === 3 || e.nodeType === 8 || !n || !r || !(u = s._data(e))) return;
            r.handler && (v = r, r = v.handler, o = v.selector), r.guid || (r.guid = s.guid++), f = u.events, f || (u.events = f = {}), a = u.handle, a || (u.handle = a = function(e) {
                return typeof s == "undefined" || !!e && s.event.triggered === e.type ? t : s.event.dispatch.apply(a.elem, arguments)
            }, a.elem = e), n = s.trim(P(n)).split(" ");
            for (l = 0; l < n.length; l++) {
                c = C.exec(n[l]) || [], h = c[1], p = (c[2] || "").split(".").sort(), y = s.event.special[h] || {}, h = (o ? y.delegateType : y.bindType) || h, y = s.event.special[h] || {}, d = s.extend({
                    type: h,
                    origType: c[1],
                    data: i,
                    handler: r,
                    guid: r.guid,
                    selector: o,
                    quick: o && _(o),
                    namespace: p.join(".")
                }, v), g = f[h];
                if (!g) {
                    g = f[h] = [], g.delegateCount = 0;
                    if (!y.setup || y.setup.call(e, i, p, a) === !1) e.addEventListener ? e.addEventListener(h, a, !1) : e.attachEvent && e.attachEvent("on" + h, a)
                }
                y.add && (y.add.call(e, d), d.handler.guid || (d.handler.guid = r.guid)), o ? g.splice(g.delegateCount++, 0, d) : g.push(d), s.event.global[h] = !0
            }
            e = null
        },
        global: {},
        remove: function(e, t, n, r, i) {
            var o = s.hasData(e) && s._data(e),
                u, a, f, l, c, h, p, d, v, m, g, y;
            if (!o || !(d = o.events)) return;
            t = s.trim(P(t || "")).split(" ");
            for (u = 0; u < t.length; u++) {
                a = C.exec(t[u]) || [], f = l = a[1], c = a[2];
                if (!f) {
                    for (f in d) s.event.remove(e, f + t[u], n, r, !0);
                    continue
                }
                v = s.event.special[f] || {}, f = (r ? v.delegateType : v.bindType) || f, g = d[f] || [], h = g.length, c = c ? new RegExp("(^|\\.)" + c.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                for (p = 0; p < g.length; p++) y = g[p], (i || l === y.origType) && (!n || n.guid === y.guid) && (!c || c.test(y.namespace)) && (!r || r === y.selector || r === "**" && y.selector) && (g.splice(p--, 1), y.selector && g.delegateCount--, v.remove && v.remove.call(e, y));
                g.length === 0 && h !== g.length && ((!v.teardown || v.teardown.call(e, c) === !1) && s.removeEvent(e, f, o.handle), delete d[f])
            }
            s.isEmptyObject(d) && (m = o.handle, m && (m.elem = null), s.removeData(e, ["events", "handle"], !0))
        },
        customEvent: {
            getData: !0,
            setData: !0,
            changeData: !0
        },
        trigger: function(n, r, i, o) {
            if (!i || i.nodeType !== 3 && i.nodeType !== 8) {
                var u = n.type || n,
                    a = [],
                    f, l, c, h, p, d, v, m, g, y;
                if (O.test(u + s.event.triggered)) return;
                u.indexOf("!") >= 0 && (u = u.slice(0, -1), l = !0), u.indexOf(".") >= 0 && (a = u.split("."), u = a.shift(), a.sort());
                if ((!i || s.event.customEvent[u]) && !s.event.global[u]) return;
                n = typeof n == "object" ? n[s.expando] ? n : new s.Event(u, n) : new s.Event(u), n.type = u, n.isTrigger = !0, n.exclusive = l, n.namespace = a.join("."), n.namespace_re = n.namespace ? new RegExp("(^|\\.)" + a.join("\\.(?:.*\\.)?") + "(\\.|$)") : null, d = u.indexOf(":") < 0 ? "on" + u : "";
                if (!i) {
                    f = s.cache;
                    for (c in f) f[c].events && f[c].events[u] && s.event.trigger(n, r, f[c].handle.elem, !0);
                    return
                }
                n.result = t, n.target || (n.target = i), r = r != null ? s.makeArray(r) : [], r.unshift(n), v = s.event.special[u] || {};
                if (v.trigger && v.trigger.apply(i, r) === !1) return;
                g = [
                    [i, v.bindType || u]
                ];
                if (!o && !v.noBubble && !s.isWindow(i)) {
                    y = v.delegateType || u, h = O.test(y + u) ? i : i.parentNode, p = null;
                    for (; h; h = h.parentNode) g.push([h, y]), p = h;
                    p && p === i.ownerDocument && g.push([p.defaultView || p.parentWindow || e, y])
                }
                for (c = 0; c < g.length && !n.isPropagationStopped(); c++) h = g[c][0], n.type = g[c][1], m = (s._data(h, "events") || {})[n.type] && s._data(h, "handle"), m && m.apply(h, r), m = d && h[d], m && s.acceptData(h) && m.apply(h, r) === !1 && n.preventDefault();
                return n.type = u, !o && !n.isDefaultPrevented() && (!v._default || v._default.apply(i.ownerDocument, r) === !1) && (u !== "click" || !s.nodeName(i, "a")) && s.acceptData(i) && d && i[u] && (u !== "focus" && u !== "blur" || n.target.offsetWidth !== 0) && !s.isWindow(i) && (p = i[d], p && (i[d] = null), s.event.triggered = u, i[u](), s.event.triggered = t, p && (i[d] = p)), n.result
            }
            return
        },
        dispatch: function(n) {
            n = s.event.fix(n || e.event);
            var r = (s._data(this, "events") || {})[n.type] || [],
                i = r.delegateCount,
                o = [].slice.call(arguments, 0),
                u = !n.exclusive && !n.namespace,
                a = s.event.special[n.type] || {},
                f = [],
                l, c, h, p, d, v, m, g, y, b, w;
            o[0] = n, n.delegateTarget = this;
            if (a.preDispatch && a.preDispatch.call(this, n) === !1) return;
            if (i && (!n.button || n.type !== "click")) {
                p = s(this), p.context = this.ownerDocument || this;
                for (h = n.target; h != this; h = h.parentNode || this)
                    if (h.disabled !== !0) {
                        v = {}, g = [], p[0] = h;
                        for (l = 0; l < i; l++) y = r[l], b = y.selector, v[b] === t && (v[b] = y.quick ? D(h, y.quick) : p.is(b)), v[b] && g.push(y);
                        g.length && f.push({
                            elem: h,
                            matches: g
                        })
                    }
            }
            r.length > i && f.push({
                elem: this,
                matches: r.slice(i)
            });
            for (l = 0; l < f.length && !n.isPropagationStopped(); l++) {
                m = f[l], n.currentTarget = m.elem;
                for (c = 0; c < m.matches.length && !n.isImmediatePropagationStopped(); c++) {
                    y = m.matches[c];
                    if (u || !n.namespace && !y.namespace || n.namespace_re && n.namespace_re.test(y.namespace)) n.data = y.data, n.handleObj = y, d = ((s.event.special[y.origType] || {}).handle || y.handler).apply(m.elem, o), d !== t && (n.result = d, d === !1 && (n.preventDefault(), n.stopPropagation()))
                }
            }
            return a.postDispatch && a.postDispatch.call(this, n), n.result
        },
        props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return e.which == null && (e.which = t.charCode != null ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, r) {
                var i, s, o, u = r.button,
                    a = r.fromElement;
                return e.pageX == null && r.clientX != null && (i = e.target.ownerDocument || n, s = i.documentElement, o = i.body, e.pageX = r.clientX + (s && s.scrollLeft || o && o.scrollLeft || 0) - (s && s.clientLeft || o && o.clientLeft || 0), e.pageY = r.clientY + (s && s.scrollTop || o && o.scrollTop || 0) - (s && s.clientTop || o && o.clientTop || 0)), !e.relatedTarget && a && (e.relatedTarget = a === e.target ? r.toElement : a), !e.which && u !== t && (e.which = u & 1 ? 1 : u & 2 ? 3 : u & 4 ? 2 : 0), e
            }
        },
        fix: function(e) {
            if (e[s.expando]) return e;
            var r, i, o = e,
                u = s.event.fixHooks[e.type] || {},
                a = u.props ? this.props.concat(u.props) : this.props;
            e = s.Event(o);
            for (r = a.length; r;) i = a[--r], e[i] = o[i];
            return e.target || (e.target = o.srcElement || n), e.target.nodeType === 3 && (e.target = e.target.parentNode), e.metaKey === t && (e.metaKey = e.ctrlKey), u.filter ? u.filter(e, o) : e
        },
        special: {
            ready: {
                setup: s.bindReady
            },
            load: {
                noBubble: !0
            },
            focus: {
                delegateType: "focusin"
            },
            blur: {
                delegateType: "focusout"
            },
            beforeunload: {
                setup: function(e, t, n) {
                    s.isWindow(this) && (this.onbeforeunload = n)
                },
                teardown: function(e, t) {
                    this.onbeforeunload === t && (this.onbeforeunload = null)
                }
            }
        },
        simulate: function(e, t, n, r) {
            var i = s.extend(new s.Event, n, {
                type: e,
                isSimulated: !0,
                originalEvent: {}
            });
            r ? s.event.trigger(i, null, t) : s.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault()
        }
    }, s.event.handle = s.event.dispatch, s.removeEvent = n.removeEventListener ? function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    } : function(e, t, n) {
        e.detachEvent && e.detachEvent("on" + t, n)
    }, s.Event = function(e, t) {
        if (!(this instanceof s.Event)) return new s.Event(e, t);
        e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? B : H) : this.type = e, t && s.extend(this, t), this.timeStamp = e && e.timeStamp || s.now(), this[s.expando] = !0
    }, s.Event.prototype = {
        preventDefault: function() {
            this.isDefaultPrevented = B;
            var e = this.originalEvent;
            if (!e) return;
            e.preventDefault ? e.preventDefault() : e.returnValue = !1
        },
        stopPropagation: function() {
            this.isPropagationStopped = B;
            var e = this.originalEvent;
            if (!e) return;
            e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = B, this.stopPropagation()
        },
        isDefaultPrevented: H,
        isPropagationStopped: H,
        isImmediatePropagationStopped: H
    }, s.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function(e, t) {
        s.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n = this,
                    r = e.relatedTarget,
                    i = e.handleObj,
                    o = i.selector,
                    u;
                if (!r || r !== n && !s.contains(n, r)) e.type = i.origType, u = i.handler.apply(this, arguments), e.type = t;
                return u
            }
        }
    }), s.support.submitBubbles || (s.event.special.submit = {
        setup: function() {
            if (s.nodeName(this, "form")) return !1;
            s.event.add(this, "click._submit keypress._submit", function(e) {
                var n = e.target,
                    r = s.nodeName(n, "input") || s.nodeName(n, "button") ? n.form : t;
                r && !r._submit_attached && (s.event.add(r, "submit._submit", function(e) {
                    e._submit_bubble = !0
                }), r._submit_attached = !0)
            })
        },
        postDispatch: function(e) {
            e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && s.event.simulate("submit", this.parentNode, e, !0))
        },
        teardown: function() {
            if (s.nodeName(this, "form")) return !1;
            s.event.remove(this, "._submit")
        }
    }), s.support.changeBubbles || (s.event.special.change = {
        setup: function() {
            if (N.test(this.nodeName)) {
                if (this.type === "checkbox" || this.type === "radio") s.event.add(this, "propertychange._change", function(e) {
                    e.originalEvent.propertyName === "checked" && (this._just_changed = !0)
                }), s.event.add(this, "click._change", function(e) {
                    this._just_changed && !e.isTrigger && (this._just_changed = !1, s.event.simulate("change", this, e, !0))
                });
                return !1
            }
            s.event.add(this, "beforeactivate._change", function(e) {
                var t = e.target;
                N.test(t.nodeName) && !t._change_attached && (s.event.add(t, "change._change", function(e) {
                    this.parentNode && !e.isSimulated && !e.isTrigger && s.event.simulate("change", this.parentNode, e, !0)
                }), t._change_attached = !0)
            })
        },
        handle: function(e) {
            var t = e.target;
            if (this !== t || e.isSimulated || e.isTrigger || t.type !== "radio" && t.type !== "checkbox") return e.handleObj.handler.apply(this, arguments)
        },
        teardown: function() {
            return s.event.remove(this, "._change"), N.test(this.nodeName)
        }
    }), s.support.focusinBubbles || s.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var r = 0,
            i = function(e) {
                s.event.simulate(t, e.target, s.event.fix(e), !0)
            };
        s.event.special[t] = {
            setup: function() {
                r++ === 0 && n.addEventListener(e, i, !0)
            },
            teardown: function() {
                --r === 0 && n.removeEventListener(e, i, !0)
            }
        }
    }), s.fn.extend({
        on: function(e, n, r, i, o) {
            var u, a;
            if (typeof e == "object") {
                typeof n != "string" && (r = r || n, n = t);
                for (a in e) this.on(a, n, r, e[a], o);
                return this
            }
            r == null && i == null ? (i = n, r = n = t) : i == null && (typeof n == "string" ? (i = r, r = t) : (i = r, r = n, n = t));
            if (i === !1) i = H;
            else if (!i) return this;
            return o === 1 && (u = i, i = function(e) {
                return s().off(e), u.apply(this, arguments)
            }, i.guid = u.guid || (u.guid = s.guid++)), this.each(function() {
                s.event.add(this, e, i, r, n)
            })
        },
        one: function(e, t, n, r) {
            return this.on(e, t, n, r, 1)
        },
        off: function(e, n, r) {
            if (e && e.preventDefault && e.handleObj) {
                var i = e.handleObj;
                return s(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this
            }
            if (typeof e == "object") {
                for (var o in e) this.off(o, n, e[o]);
                return this
            }
            if (n === !1 || typeof n == "function") r = n, n = t;
            return r === !1 && (r = H), this.each(function() {
                s.event.remove(this, e, r, n)
            })
        },
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        live: function(e, t, n) {
            return s(this.context).on(e, this.selector, t, n), this
        },
        die: function(e, t) {
            return s(this.context).off(e, this.selector || "**", t), this
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return arguments.length == 1 ? this.off(e, "**") : this.off(t, e, n)
        },
        trigger: function(e, t) {
            return this.each(function() {
                s.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            if (this[0]) return s.event.trigger(e, t, this[0], !0)
        },
        toggle: function(e) {
            var t = arguments,
                n = e.guid || s.guid++,
                r = 0,
                i = function(n) {
                    var i = (s._data(this, "lastToggle" + e.guid) || 0) % r;
                    return s._data(this, "lastToggle" + e.guid, i + 1), n.preventDefault(), t[i].apply(this, arguments) || !1
                };
            i.guid = n;
            while (r < t.length) t[r++].guid = n;
            return this.click(i)
        },
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }), s.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
        s.fn[t] = function(e, n) {
            return n == null && (n = e, e = null), arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }, s.attrFn && (s.attrFn[t] = !0), L.test(t) && (s.event.fixHooks[t] = s.event.keyHooks), A.test(t) && (s.event.fixHooks[t] = s.event.mouseHooks)
    }),
    function() {
        function S(e, t, n, i, s, o) {
            for (var u = 0, a = i.length; u < a; u++) {
                var f = i[u];
                if (f) {
                    var l = !1;
                    f = f[e];
                    while (f) {
                        if (f[r] === n) {
                            l = i[f.sizset];
                            break
                        }
                        f.nodeType === 1 && !o && (f[r] = n, f.sizset = u);
                        if (f.nodeName.toLowerCase() === t) {
                            l = f;
                            break
                        }
                        f = f[e]
                    }
                    i[u] = l
                }
            }
        }

        function x(e, t, n, i, s, o) {
            for (var u = 0, a = i.length; u < a; u++) {
                var f = i[u];
                if (f) {
                    var l = !1;
                    f = f[e];
                    while (f) {
                        if (f[r] === n) {
                            l = i[f.sizset];
                            break
                        }
                        if (f.nodeType === 1) {
                            o || (f[r] = n, f.sizset = u);
                            if (typeof t != "string") {
                                if (f === t) {
                                    l = !0;
                                    break
                                }
                            } else if (h.filter(t, [f]).length > 0) {
                                l = f;
                                break
                            }
                        }
                        f = f[e]
                    }
                    i[u] = l
                }
            }
        }
        var e = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
            r = "sizcache" + (Math.random() + "").replace(".", ""),
            i = 0,
            o = Object.prototype.toString,
            u = !1,
            a = !0,
            f = /\\/g,
            l = /\r\n/g,
            c = /\W/;
        [0, 0].sort(function() {
            return a = !1, 0
        });
        var h = function(t, r, i, s) {
            i = i || [], r = r || n;
            var u = r;
            if (r.nodeType !== 1 && r.nodeType !== 9) return [];
            if (!t || typeof t != "string") return i;
            var a, f, l, c, p, m, g, b, w = !0,
                E = h.isXML(r),
                S = [],
                x = t;
            do {
                e.exec(""), a = e.exec(x);
                if (a) {
                    x = a[3], S.push(a[1]);
                    if (a[2]) {
                        c = a[3];
                        break
                    }
                }
            } while (a);
            if (S.length > 1 && v.exec(t))
                if (S.length === 2 && d.relative[S[0]]) f = T(S[0] + S[1], r, s);
                else {
                    f = d.relative[S[0]] ? [r] : h(S.shift(), r);
                    while (S.length) t = S.shift(), d.relative[t] && (t += S.shift()), f = T(t, f, s)
                } else {
                !s && S.length > 1 && r.nodeType === 9 && !E && d.match.ID.test(S[0]) && !d.match.ID.test(S[S.length - 1]) && (p = h.find(S.shift(), r, E), r = p.expr ? h.filter(p.expr, p.set)[0] : p.set[0]);
                if (r) {
                    p = s ? {
                        expr: S.pop(),
                        set: y(s)
                    } : h.find(S.pop(), S.length !== 1 || S[0] !== "~" && S[0] !== "+" || !r.parentNode ? r : r.parentNode, E), f = p.expr ? h.filter(p.expr, p.set) : p.set, S.length > 0 ? l = y(f) : w = !1;
                    while (S.length) m = S.pop(), g = m, d.relative[m] ? g = S.pop() : m = "", g == null && (g = r), d.relative[m](l, g, E)
                } else l = S = []
            }
            l || (l = f), l || h.error(m || t);
            if (o.call(l) === "[object Array]")
                if (!w) i.push.apply(i, l);
                else if (r && r.nodeType === 1)
                for (b = 0; l[b] != null; b++) l[b] && (l[b] === !0 || l[b].nodeType === 1 && h.contains(r, l[b])) && i.push(f[b]);
            else
                for (b = 0; l[b] != null; b++) l[b] && l[b].nodeType === 1 && i.push(f[b]);
            else y(l, i);
            return c && (h(c, u, i, s), h.uniqueSort(i)), i
        };
        h.uniqueSort = function(e) {
            if (w) {
                u = a, e.sort(w);
                if (u)
                    for (var t = 1; t < e.length; t++) e[t] === e[t - 1] && e.splice(t--, 1)
            }
            return e
        }, h.matches = function(e, t) {
            return h(e, null, null, t)
        }, h.matchesSelector = function(e, t) {
            return h(t, null, null, [e]).length > 0
        }, h.find = function(e, t, n) {
            var r, i, s, o, u, a;
            if (!e) return [];
            for (i = 0, s = d.order.length; i < s; i++) {
                u = d.order[i];
                if (o = d.leftMatch[u].exec(e)) {
                    a = o[1], o.splice(1, 1);
                    if (a.substr(a.length - 1) !== "\\") {
                        o[1] = (o[1] || "").replace(f, ""), r = d.find[u](o, t, n);
                        if (r != null) {
                            e = e.replace(d.match[u], "");
                            break
                        }
                    }
                }
            }
            return r || (r = typeof t.getElementsByTagName != "undefined" ? t.getElementsByTagName("*") : []), {
                set: r,
                expr: e
            }
        }, h.filter = function(e, n, r, i) {
            var s, o, u, a, f, l, c, p, v, m = e,
                g = [],
                y = n,
                b = n && n[0] && h.isXML(n[0]);
            while (e && n.length) {
                for (u in d.filter)
                    if ((s = d.leftMatch[u].exec(e)) != null && s[2]) {
                        l = d.filter[u], c = s[1], o = !1, s.splice(1, 1);
                        if (c.substr(c.length - 1) === "\\") continue;
                        y === g && (g = []);
                        if (d.preFilter[u]) {
                            s = d.preFilter[u](s, y, r, g, i, b);
                            if (!s) o = a = !0;
                            else if (s === !0) continue
                        }
                        if (s)
                            for (p = 0;
                                (f = y[p]) != null; p++) f && (a = l(f, s, p, y), v = i ^ a, r && a != null ? v ? o = !0 : y[p] = !1 : v && (g.push(f), o = !0));
                        if (a !== t) {
                            r || (y = g), e = e.replace(d.match[u], "");
                            if (!o) return [];
                            break
                        }
                    }
                if (e === m) {
                    if (o != null) break;
                    h.error(e)
                }
                m = e
            }
            return y
        }, h.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        };
        var p = h.getText = function(e) {
                var t, n, r = e.nodeType,
                    i = "";
                if (r) {
                    if (r === 1 || r === 9 || r === 11) {
                        if (typeof e.textContent == "string") return e.textContent;
                        if (typeof e.innerText == "string") return e.innerText.replace(l, "");
                        for (e = e.firstChild; e; e = e.nextSibling) i += p(e)
                    } else if (r === 3 || r === 4) return e.nodeValue
                } else
                    for (t = 0; n = e[t]; t++) n.nodeType !== 8 && (i += p(n));
                return i
            },
            d = h.selectors = {
                order: ["ID", "NAME", "TAG"],
                match: {
                    ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                    CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                    NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                    ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                    TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                    CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                    POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                    PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
                },
                leftMatch: {},
                attrMap: {
                    "class": "className",
                    "for": "htmlFor"
                },
                attrHandle: {
                    href: function(e) {
                        return e.getAttribute("href")
                    },
                    type: function(e) {
                        return e.getAttribute("type")
                    }
                },
                relative: {
                    "+": function(e, t) {
                        var n = typeof t == "string",
                            r = n && !c.test(t),
                            i = n && !r;
                        r && (t = t.toLowerCase());
                        for (var s = 0, o = e.length, u; s < o; s++)
                            if (u = e[s]) {
                                while ((u = u.previousSibling) && u.nodeType !== 1);
                                e[s] = i || u && u.nodeName.toLowerCase() === t ? u || !1 : u === t
                            }
                        i && h.filter(t, e, !0)
                    },
                    ">": function(e, t) {
                        var n, r = typeof t == "string",
                            i = 0,
                            s = e.length;
                        if (r && !c.test(t)) {
                            t = t.toLowerCase();
                            for (; i < s; i++) {
                                n = e[i];
                                if (n) {
                                    var o = n.parentNode;
                                    e[i] = o.nodeName.toLowerCase() === t ? o : !1
                                }
                            }
                        } else {
                            for (; i < s; i++) n = e[i], n && (e[i] = r ? n.parentNode : n.parentNode === t);
                            r && h.filter(t, e, !0)
                        }
                    },
                    "": function(e, t, n) {
                        var r, s = i++,
                            o = x;
                        typeof t == "string" && !c.test(t) && (t = t.toLowerCase(), r = t, o = S), o("parentNode", t, s, e, r, n)
                    },
                    "~": function(e, t, n) {
                        var r, s = i++,
                            o = x;
                        typeof t == "string" && !c.test(t) && (t = t.toLowerCase(), r = t, o = S), o("previousSibling", t, s, e, r, n)
                    }
                },
                find: {
                    ID: function(e, t, n) {
                        if (typeof t.getElementById != "undefined" && !n) {
                            var r = t.getElementById(e[1]);
                            return r && r.parentNode ? [r] : []
                        }
                    },
                    NAME: function(e, t) {
                        if (typeof t.getElementsByName != "undefined") {
                            var n = [],
                                r = t.getElementsByName(e[1]);
                            for (var i = 0, s = r.length; i < s; i++) r[i].getAttribute("name") === e[1] && n.push(r[i]);
                            return n.length === 0 ? null : n
                        }
                    },
                    TAG: function(e, t) {
                        if (typeof t.getElementsByTagName != "undefined") return t.getElementsByTagName(e[1])
                    }
                },
                preFilter: {
                    CLASS: function(e, t, n, r, i, s) {
                        e = " " + e[1].replace(f, "") + " ";
                        if (s) return e;
                        for (var o = 0, u;
                            (u = t[o]) != null; o++) u && (i ^ (u.className && (" " + u.className + " ").replace(/[\t\n\r]/g, " ").indexOf(e) >= 0) ? n || r.push(u) : n && (t[o] = !1));
                        return !1
                    },
                    ID: function(e) {
                        return e[1].replace(f, "")
                    },
                    TAG: function(e, t) {
                        return e[1].replace(f, "").toLowerCase()
                    },
                    CHILD: function(e) {
                        if (e[1] === "nth") {
                            e[2] || h.error(e[0]), e[2] = e[2].replace(/^\+|\s*/g, "");
                            var t = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(e[2] === "even" && "2n" || e[2] === "odd" && "2n+1" || !/\D/.test(e[2]) && "0n+" + e[2] || e[2]);
                            e[2] = t[1] + (t[2] || 1) - 0, e[3] = t[3] - 0
                        } else e[2] && h.error(e[0]);
                        return e[0] = i++, e
                    },
                    ATTR: function(e, t, n, r, i, s) {
                        var o = e[1] = e[1].replace(f, "");
                        return !s && d.attrMap[o] && (e[1] = d.attrMap[o]), e[4] = (e[4] || e[5] || "").replace(f, ""), e[2] === "~=" && (e[4] = " " + e[4] + " "), e
                    },
                    PSEUDO: function(t, n, r, i, s) {
                        if (t[1] === "not") {
                            if (!((e.exec(t[3]) || "").length > 1 || /^\w/.test(t[3]))) {
                                var o = h.filter(t[3], n, r, !0 ^ s);
                                return r || i.push.apply(i, o), !1
                            }
                            t[3] = h(t[3], null, null, n)
                        } else if (d.match.POS.test(t[0]) || d.match.CHILD.test(t[0])) return !0;
                        return t
                    },
                    POS: function(e) {
                        return e.unshift(!0), e
                    }
                },
                filters: {
                    enabled: function(e) {
                        return e.disabled === !1 && e.type !== "hidden"
                    },
                    disabled: function(e) {
                        return e.disabled === !0
                    },
                    checked: function(e) {
                        return e.checked === !0
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                    },
                    parent: function(e) {
                        return !!e.firstChild
                    },
                    empty: function(e) {
                        return !e.firstChild
                    },
                    has: function(e, t, n) {
                        return !!h(n[3], e).length
                    },
                    header: function(e) {
                        return /h\d/i.test(e.nodeName)
                    },
                    text: function(e) {
                        var t = e.getAttribute("type"),
                            n = e.type;
                        return e.nodeName.toLowerCase() === "input" && "text" === n && (t === n || t === null)
                    },
                    radio: function(e) {
                        return e.nodeName.toLowerCase() === "input" && "radio" === e.type
                    },
                    checkbox: function(e) {
                        return e.nodeName.toLowerCase() === "input" && "checkbox" === e.type
                    },
                    file: function(e) {
                        return e.nodeName.toLowerCase() === "input" && "file" === e.type
                    },
                    password: function(e) {
                        return e.nodeName.toLowerCase() === "input" && "password" === e.type
                    },
                    submit: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return (t === "input" || t === "button") && "submit" === e.type
                    },
                    image: function(e) {
                        return e.nodeName.toLowerCase() === "input" && "image" === e.type
                    },
                    reset: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return (t === "input" || t === "button") && "reset" === e.type
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return t === "input" && "button" === e.type || t === "button"
                    },
                    input: function(e) {
                        return /input|select|textarea|button/i.test(e.nodeName)
                    },
                    focus: function(e) {
                        return e === e.ownerDocument.activeElement
                    }
                },
                setFilters: {
                    first: function(e, t) {
                        return t === 0
                    },
                    last: function(e, t, n, r) {
                        return t === r.length - 1
                    },
                    even: function(e, t) {
                        return t % 2 === 0
                    },
                    odd: function(e, t) {
                        return t % 2 === 1
                    },
                    lt: function(e, t, n) {
                        return t < n[3] - 0
                    },
                    gt: function(e, t, n) {
                        return t > n[3] - 0
                    },
                    nth: function(e, t, n) {
                        return n[3] - 0 === t
                    },
                    eq: function(e, t, n) {
                        return n[3] - 0 === t
                    }
                },
                filter: {
                    PSEUDO: function(e, t, n, r) {
                        var i = t[1],
                            s = d.filters[i];
                        if (s) return s(e, n, t, r);
                        if (i === "contains") return (e.textContent || e.innerText || p([e]) || "").indexOf(t[3]) >= 0;
                        if (i === "not") {
                            var o = t[3];
                            for (var u = 0, a = o.length; u < a; u++)
                                if (o[u] === e) return !1;
                            return !0
                        }
                        h.error(i)
                    },
                    CHILD: function(e, t) {
                        var n, i, s, o, u, a, f, l = t[1],
                            c = e;
                        switch (l) {
                            case "only":
                            case "first":
                                while (c = c.previousSibling)
                                    if (c.nodeType === 1) return !1;
                                if (l === "first") return !0;
                                c = e;
                            case "last":
                                while (c = c.nextSibling)
                                    if (c.nodeType === 1) return !1;
                                return !0;
                            case "nth":
                                n = t[2], i = t[3];
                                if (n === 1 && i === 0) return !0;
                                s = t[0], o = e.parentNode;
                                if (o && (o[r] !== s || !e.nodeIndex)) {
                                    a = 0;
                                    for (c = o.firstChild; c; c = c.nextSibling) c.nodeType === 1 && (c.nodeIndex = ++a);
                                    o[r] = s
                                }
                                return f = e.nodeIndex - i, n === 0 ? f === 0 : f % n === 0 && f / n >= 0
                        }
                    },
                    ID: function(e, t) {
                        return e.nodeType === 1 && e.getAttribute("id") === t
                    },
                    TAG: function(e, t) {
                        return t === "*" && e.nodeType === 1 || !!e.nodeName && e.nodeName.toLowerCase() === t
                    },
                    CLASS: function(e, t) {
                        return (" " + (e.className || e.getAttribute("class")) + " ").indexOf(t) > -1
                    },
                    ATTR: function(e, t) {
                        var n = t[1],
                            r = h.attr ? h.attr(e, n) : d.attrHandle[n] ? d.attrHandle[n](e) : e[n] != null ? e[n] : e.getAttribute(n),
                            i = r + "",
                            s = t[2],
                            o = t[4];
                        return r == null ? s === "!=" : !s && h.attr ? r != null : s === "=" ? i === o : s === "*=" ? i.indexOf(o) >= 0 : s === "~=" ? (" " + i + " ").indexOf(o) >= 0 : o ? s === "!=" ? i !== o : s === "^=" ? i.indexOf(o) === 0 : s === "$=" ? i.substr(i.length - o.length) === o : s === "|=" ? i === o || i.substr(0, o.length + 1) === o + "-" : !1 : i && r !== !1
                    },
                    POS: function(e, t, n, r) {
                        var i = t[2],
                            s = d.setFilters[i];
                        if (s) return s(e, n, t, r)
                    }
                }
            },
            v = d.match.POS,
            m = function(e, t) {
                return "\\" + (t - 0 + 1)
            };
        for (var g in d.match) d.match[g] = new RegExp(d.match[g].source + /(?![^\[]*\])(?![^\(]*\))/.source), d.leftMatch[g] = new RegExp(/(^(?:.|\r|\n)*?)/.source + d.match[g].source.replace(/\\(\d+)/g, m));
        d.match.globalPOS = v;
        var y = function(e, t) {
            return e = Array.prototype.slice.call(e, 0), t ? (t.push.apply(t, e), t) : e
        };
        try {
            Array.prototype.slice.call(n.documentElement.childNodes, 0)[0].nodeType
        } catch (b) {
            y = function(e, t) {
                var n = 0,
                    r = t || [];
                if (o.call(e) === "[object Array]") Array.prototype.push.apply(r, e);
                else if (typeof e.length == "number")
                    for (var i = e.length; n < i; n++) r.push(e[n]);
                else
                    for (; e[n]; n++) r.push(e[n]);
                return r
            }
        }
        var w, E;
        n.documentElement.compareDocumentPosition ? w = function(e, t) {
            return e === t ? (u = !0, 0) : !e.compareDocumentPosition || !t.compareDocumentPosition ? e.compareDocumentPosition ? -1 : 1 : e.compareDocumentPosition(t) & 4 ? -1 : 1
        } : (w = function(e, t) {
            if (e === t) return u = !0, 0;
            if (e.sourceIndex && t.sourceIndex) return e.sourceIndex - t.sourceIndex;
            var n, r, i = [],
                s = [],
                o = e.parentNode,
                a = t.parentNode,
                f = o;
            if (o === a) return E(e, t);
            if (!o) return -1;
            if (!a) return 1;
            while (f) i.unshift(f), f = f.parentNode;
            f = a;
            while (f) s.unshift(f), f = f.parentNode;
            n = i.length, r = s.length;
            for (var l = 0; l < n && l < r; l++)
                if (i[l] !== s[l]) return E(i[l], s[l]);
            return l === n ? E(e, s[l], -1) : E(i[l], t, 1)
        }, E = function(e, t, n) {
            if (e === t) return n;
            var r = e.nextSibling;
            while (r) {
                if (r === t) return -1;
                r = r.nextSibling
            }
            return 1
        }),
        function() {
            var e = n.createElement("div"),
                r = "script" + (new Date).getTime(),
                i = n.documentElement;
            e.innerHTML = "<a name='" + r + "'/>", i.insertBefore(e, i.firstChild), n.getElementById(r) && (d.find.ID = function(e, n, r) {
                if (typeof n.getElementById != "undefined" && !r) {
                    var i = n.getElementById(e[1]);
                    return i ? i.id === e[1] || typeof i.getAttributeNode != "undefined" && i.getAttributeNode("id").nodeValue === e[1] ? [i] : t : []
                }
            }, d.filter.ID = function(e, t) {
                var n = typeof e.getAttributeNode != "undefined" && e.getAttributeNode("id");
                return e.nodeType === 1 && n && n.nodeValue === t
            }), i.removeChild(e), i = e = null
        }(),
        function() {
            var e = n.createElement("div");
            e.appendChild(n.createComment("")), e.getElementsByTagName("*").length > 0 && (d.find.TAG = function(e, t) {
                var n = t.getElementsByTagName(e[1]);
                if (e[1] === "*") {
                    var r = [];
                    for (var i = 0; n[i]; i++) n[i].nodeType === 1 && r.push(n[i]);
                    n = r
                }
                return n
            }), e.innerHTML = "<a href='#'></a>", e.firstChild && typeof e.firstChild.getAttribute != "undefined" && e.firstChild.getAttribute("href") !== "#" && (d.attrHandle.href = function(e) {
                return e.getAttribute("href", 2)
            }), e = null
        }(), n.querySelectorAll && function() {
            var e = h,
                t = n.createElement("div"),
                r = "__sizzle__";
            t.innerHTML = "<p class='TEST'></p>";
            if (t.querySelectorAll && t.querySelectorAll(".TEST").length === 0) return;
            h = function(t, i, s, o) {
                i = i || n;
                if (!o && !h.isXML(i)) {
                    var u = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(t);
                    if (u && (i.nodeType === 1 || i.nodeType === 9)) {
                        if (u[1]) return y(i.getElementsByTagName(t), s);
                        if (u[2] && d.find.CLASS && i.getElementsByClassName) return y(i.getElementsByClassName(u[2]), s)
                    }
                    if (i.nodeType === 9) {
                        if (t === "body" && i.body) return y([i.body], s);
                        if (u && u[3]) {
                            var a = i.getElementById(u[3]);
                            if (!a || !a.parentNode) return y([], s);
                            if (a.id === u[3]) return y([a], s)
                        }
                        try {
                            return y(i.querySelectorAll(t), s)
                        } catch (f) {}
                    } else if (i.nodeType === 1 && i.nodeName.toLowerCase() !== "object") {
                        var l = i,
                            c = i.getAttribute("id"),
                            p = c || r,
                            v = i.parentNode,
                            m = /^\s*[+~]/.test(t);
                        c ? p = p.replace(/'/g, "\\$&") : i.setAttribute("id", p), m && v && (i = i.parentNode);
                        try {
                            if (!m || v) return y(i.querySelectorAll("[id='" + p + "'] " + t), s)
                        } catch (g) {} finally {
                            c || l.removeAttribute("id")
                        }
                    }
                }
                return e(t, i, s, o)
            };
            for (var i in e) h[i] = e[i];
            t = null
        }(),
        function() {
            var e = n.documentElement,
                t = e.matchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.msMatchesSelector;
            if (t) {
                var r = !t.call(n.createElement("div"), "div"),
                    i = !1;
                try {
                    t.call(n.documentElement, "[test!='']:sizzle")
                } catch (s) {
                    i = !0
                }
                h.matchesSelector = function(e, n) {
                    n = n.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                    if (!h.isXML(e)) try {
                        if (i || !d.match.PSEUDO.test(n) && !/!=/.test(n)) {
                            var s = t.call(e, n);
                            if (s || !r || e.document && e.document.nodeType !== 11) return s
                        }
                    } catch (o) {}
                    return h(n, null, null, [e]).length > 0
                }
            }
        }(),
        function() {
            var e = n.createElement("div");
            e.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (!e.getElementsByClassName || e.getElementsByClassName("e").length === 0) return;
            e.lastChild.className = "e";
            if (e.getElementsByClassName("e").length === 1) return;
            d.order.splice(1, 0, "CLASS"), d.find.CLASS = function(e, t, n) {
                if (typeof t.getElementsByClassName != "undefined" && !n) return t.getElementsByClassName(e[1])
            }, e = null
        }(), n.documentElement.contains ? h.contains = function(e, t) {
            return e !== t && (e.contains ? e.contains(t) : !0)
        } : n.documentElement.compareDocumentPosition ? h.contains = function(e, t) {
            return !!(e.compareDocumentPosition(t) & 16)
        } : h.contains = function() {
            return !1
        }, h.isXML = function(e) {
            var t = (e ? e.ownerDocument || e : 0).documentElement;
            return t ? t.nodeName !== "HTML" : !1
        };
        var T = function(e, t, n) {
            var r, i = [],
                s = "",
                o = t.nodeType ? [t] : t;
            while (r = d.match.PSEUDO.exec(e)) s += r[0], e = e.replace(d.match.PSEUDO, "");
            e = d.relative[e] ? e + "*" : e;
            for (var u = 0, a = o.length; u < a; u++) h(e, o[u], i, n);
            return h.filter(s, i)
        };
        h.attr = s.attr, h.selectors.attrMap = {}, s.find = h, s.expr = h.selectors, s.expr[":"] = s.expr.filters, s.unique = h.uniqueSort, s.text = h.getText, s.isXMLDoc = h.isXML, s.contains = h.contains
    }();
    var j = /Until$/,
        F = /^(?:parents|prevUntil|prevAll)/,
        I = /,/,
        q = /^.[^:#\[\.,]*$/,
        R = Array.prototype.slice,
        U = s.expr.match.globalPOS,
        z = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    s.fn.extend({
        find: function(e) {
            var t = this,
                n, r;
            if (typeof e != "string") return s(e).filter(function() {
                for (n = 0, r = t.length; n < r; n++)
                    if (s.contains(t[n], this)) return !0
            });
            var i = this.pushStack("", "find", e),
                o, u, a;
            for (n = 0, r = this.length; n < r; n++) {
                o = i.length, s.find(e, this[n], i);
                if (n > 0)
                    for (u = o; u < i.length; u++)
                        for (a = 0; a < o; a++)
                            if (i[a] === i[u]) {
                                i.splice(u--, 1);
                                break
                            }
            }
            return i
        },
        has: function(e) {
            var t = s(e);
            return this.filter(function() {
                for (var e = 0, n = t.length; e < n; e++)
                    if (s.contains(this, t[e])) return !0
            })
        },
        not: function(e) {
            return this.pushStack(X(this, e, !1), "not", e)
        },
        filter: function(e) {
            return this.pushStack(X(this, e, !0), "filter", e)
        },
        is: function(e) {
            return !!e && (typeof e == "string" ? U.test(e) ? s(e, this.context).index(this[0]) >= 0 : s.filter(e, this).length > 0 : this.filter(e).length > 0)
        },
        closest: function(e, t) {
            var n = [],
                r, i, o = this[0];
            if (s.isArray(e)) {
                var u = 1;
                while (o && o.ownerDocument && o !== t) {
                    for (r = 0; r < e.length; r++) s(o).is(e[r]) && n.push({
                        selector: e[r],
                        elem: o,
                        level: u
                    });
                    o = o.parentNode, u++
                }
                return n
            }
            var a = U.test(e) || typeof e != "string" ? s(e, t || this.context) : 0;
            for (r = 0, i = this.length; r < i; r++) {
                o = this[r];
                while (o) {
                    if (a ? a.index(o) > -1 : s.find.matchesSelector(o, e)) {
                        n.push(o);
                        break
                    }
                    o = o.parentNode;
                    if (!o || !o.ownerDocument || o === t || o.nodeType === 11) break
                }
            }
            return n = n.length > 1 ? s.unique(n) : n, this.pushStack(n, "closest", e)
        },
        index: function(e) {
            return e ? typeof e == "string" ? s.inArray(this[0], s(e)) : s.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1
        },
        add: function(e, t) {
            var n = typeof e == "string" ? s(e, t) : s.makeArray(e && e.nodeType ? [e] : e),
                r = s.merge(this.get(), n);
            return this.pushStack(W(n[0]) || W(r[0]) ? r : s.unique(r))
        },
        andSelf: function() {
            return this.add(this.prevObject)
        }
    }), s.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && t.nodeType !== 11 ? t : null
        },
        parents: function(e) {
            return s.dir(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return s.dir(e, "parentNode", n)
        },
        next: function(e) {
            return s.nth(e, 2, "nextSibling")
        },
        prev: function(e) {
            return s.nth(e, 2, "previousSibling")
        },
        nextAll: function(e) {
            return s.dir(e, "nextSibling")
        },
        prevAll: function(e) {
            return s.dir(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return s.dir(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return s.dir(e, "previousSibling", n)
        },
        siblings: function(e) {
            return s.sibling((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return s.sibling(e.firstChild)
        },
        contents: function(e) {
            return s.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : s.makeArray(e.childNodes)
        }
    }, function(e, t) {
        s.fn[e] = function(n, r) {
            var i = s.map(this, t, n);
            return j.test(e) || (r = n), r && typeof r == "string" && (i = s.filter(r, i)), i = this.length > 1 && !z[e] ? s.unique(i) : i, (this.length > 1 || I.test(r)) && F.test(e) && (i = i.reverse()), this.pushStack(i, e, R.call(arguments).join(","))
        }
    }), s.extend({
        filter: function(e, t, n) {
            return n && (e = ":not(" + e + ")"), t.length === 1 ? s.find.matchesSelector(t[0], e) ? [t[0]] : [] : s.find.matches(e, t)
        },
        dir: function(e, n, r) {
            var i = [],
                o = e[n];
            while (o && o.nodeType !== 9 && (r === t || o.nodeType !== 1 || !s(o).is(r))) o.nodeType === 1 && i.push(o), o = o[n];
            return i
        },
        nth: function(e, t, n, r) {
            t = t || 1;
            var i = 0;
            for (; e; e = e[n])
                if (e.nodeType === 1 && ++i === t) break;
            return e
        },
        sibling: function(e, t) {
            var n = [];
            for (; e; e = e.nextSibling) e.nodeType === 1 && e !== t && n.push(e);
            return n
        }
    });
    var $ = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        J = / jQuery\d+="(?:\d+|null)"/g,
        K = /^\s+/,
        Q = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        G = /<([\w:]+)/,
        Y = /<tbody/i,
        Z = /<|&#?\w+;/,
        et = /<(?:script|style)/i,
        tt = /<(?:script|object|embed|option|style)/i,
        nt = new RegExp("<(?:" + $ + ")[\\s/>]", "i"),
        rt = /checked\s*(?:[^=]|=\s*.checked.)/i,
        it = /\/(java|ecma)script/i,
        st = /^\s*<!(?:\[CDATA\[|\-\-)/,
        ot = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            area: [1, "<map>", "</map>"],
            _default: [0, "", ""]
        },
        ut = V(n);
    ot.optgroup = ot.option, ot.tbody = ot.tfoot = ot.colgroup = ot.caption = ot.thead, ot.th = ot.td, s.support.htmlSerialize || (ot._default = [1, "div<div>", "</div>"]), s.fn.extend({
        text: function(e) {
            return s.access(this, function(e) {
                return e === t ? s.text(this) : this.empty().append((this[0] && this[0].ownerDocument || n).createTextNode(e))
            }, null, e, arguments.length)
        },
        wrapAll: function(e) {
            if (s.isFunction(e)) return this.each(function(t) {
                s(this).wrapAll(e.call(this, t))
            });
            if (this[0]) {
                var t = s(e, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                    var e = this;
                    while (e.firstChild && e.firstChild.nodeType === 1) e = e.firstChild;
                    return e
                }).append(this)
            }
            return this
        },
        wrapInner: function(e) {
            return s.isFunction(e) ? this.each(function(t) {
                s(this).wrapInner(e.call(this, t))
            }) : this.each(function() {
                var t = s(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = s.isFunction(e);
            return this.each(function(n) {
                s(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                s.nodeName(this, "body") || s(this).replaceWith(this.childNodes)
            }).end()
        },
        append: function() {
            return this.domManip(arguments, !0, function(e) {
                this.nodeType === 1 && this.appendChild(e)
            })
        },
        prepend: function() {
            return this.domManip(arguments, !0, function(e) {
                this.nodeType === 1 && this.insertBefore(e, this.firstChild)
            })
        },
        before: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(e) {
                this.parentNode.insertBefore(e, this)
            });
            if (arguments.length) {
                var e = s.clean(arguments);
                return e.push.apply(e, this.toArray()), this.pushStack(e, "before", arguments)
            }
        },
        after: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(e) {
                this.parentNode.insertBefore(e, this.nextSibling)
            });
            if (arguments.length) {
                var e = this.pushStack(this, "after", arguments);
                return e.push.apply(e, s.clean(arguments)), e
            }
        },
        remove: function(e, t) {
            for (var n = 0, r;
                (r = this[n]) != null; n++)
                if (!e || s.filter(e, [r]).length)!t && r.nodeType === 1 && (s.cleanData(r.getElementsByTagName("*")), s.cleanData([r])), r.parentNode && r.parentNode.removeChild(r);
            return this
        },
        empty: function() {
            for (var e = 0, t;
                (t = this[e]) != null; e++) {
                t.nodeType === 1 && s.cleanData(t.getElementsByTagName("*"));
                while (t.firstChild) t.removeChild(t.firstChild)
            }
            return this
        },
        clone: function(e, t) {
            return e = e == null ? !1 : e, t = t == null ? e : t, this.map(function() {
                return s.clone(this, e, t)
            })
        },
        html: function(e) {
            return s.access(this, function(e) {
                var n = this[0] || {},
                    r = 0,
                    i = this.length;
                if (e === t) return n.nodeType === 1 ? n.innerHTML.replace(J, "") : null;
                if (typeof e == "string" && !et.test(e) && (s.support.leadingWhitespace || !K.test(e)) && !ot[(G.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = e.replace(Q, "<$1></$2>");
                    try {
                        for (; r < i; r++) n = this[r] || {}, n.nodeType === 1 && (s.cleanData(n.getElementsByTagName("*")), n.innerHTML = e);
                        n = 0
                    } catch (o) {}
                }
                n && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function(e) {
            return this[0] && this[0].parentNode ? s.isFunction(e) ? this.each(function(t) {
                var n = s(this),
                    r = n.html();
                n.replaceWith(e.call(this, t, r))
            }) : (typeof e != "string" && (e = s(e).detach()), this.each(function() {
                var t = this.nextSibling,
                    n = this.parentNode;
                s(this).remove(), t ? s(t).before(e) : s(n).append(e)
            })) : this.length ? this.pushStack(s(s.isFunction(e) ? e() : e), "replaceWith", e) : this
        },
        detach: function(e) {
            return this.remove(e, !0)
        },
        domManip: function(e, n, r) {
            var i, o, u, a, f = e[0],
                l = [];
            if (!s.support.checkClone && arguments.length === 3 && typeof f == "string" && rt.test(f)) return this.each(function() {
                s(this).domManip(e, n, r, !0)
            });
            if (s.isFunction(f)) return this.each(function(i) {
                var o = s(this);
                e[0] = f.call(this, i, n ? o.html() : t), o.domManip(e, n, r)
            });
            if (this[0]) {
                a = f && f.parentNode, s.support.parentNode && a && a.nodeType === 11 && a.childNodes.length === this.length ? i = {
                    fragment: a
                } : i = s.buildFragment(e, this, l), u = i.fragment, u.childNodes.length === 1 ? o = u = u.firstChild : o = u.firstChild;
                if (o) {
                    n = n && s.nodeName(o, "tr");
                    for (var c = 0, h = this.length, p = h - 1; c < h; c++) r.call(n ? at(this[c], o) : this[c], i.cacheable || h > 1 && c < p ? s.clone(u, !0, !0) : u)
                }
                l.length && s.each(l, function(e, t) {
                    t.src ? s.ajax({
                        type: "GET",
                        global: !1,
                        url: t.src,
                        async: !1,
                        dataType: "script"
                    }) : s.globalEval((t.text || t.textContent || t.innerHTML || "").replace(st, "/*$0*/")), t.parentNode && t.parentNode.removeChild(t)
                })
            }
            return this
        }
    }), s.buildFragment = function(e, t, r) {
        var i, o, u, a, f = e[0];
        return t && t[0] && (a = t[0].ownerDocument || t[0]), a.createDocumentFragment || (a = n), e.length === 1 && typeof f == "string" && f.length < 512 && a === n && f.charAt(0) === "<" && !tt.test(f) && (s.support.checkClone || !rt.test(f)) && (s.support.html5Clone || !nt.test(f)) && (o = !0, u = s.fragments[f], u && u !== 1 && (i = u)), i || (i = a.createDocumentFragment(), s.clean(e, a, i, r)), o && (s.fragments[f] = u ? i : 1), {
            fragment: i,
            cacheable: o
        }
    }, s.fragments = {}, s.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        s.fn[e] = function(n) {
            var r = [],
                i = s(n),
                o = this.length === 1 && this[0].parentNode;
            if (o && o.nodeType === 11 && o.childNodes.length === 1 && i.length === 1) return i[t](this[0]), this;
            for (var u = 0, a = i.length; u < a; u++) {
                var f = (u > 0 ? this.clone(!0) : this).get();
                s(i[u])[t](f), r = r.concat(f)
            }
            return this.pushStack(r, e, i.selector)
        }
    }), s.extend({
        clone: function(e, t, n) {
            var r, i, o, u = s.support.html5Clone || s.isXMLDoc(e) || !nt.test("<" + e.nodeName + ">") ? e.cloneNode(!0) : dt(e);
            if ((!s.support.noCloneEvent || !s.support.noCloneChecked) && (e.nodeType === 1 || e.nodeType === 11) && !s.isXMLDoc(e)) {
                lt(e, u), r = ct(e), i = ct(u);
                for (o = 0; r[o]; ++o) i[o] && lt(r[o], i[o])
            }
            if (t) {
                ft(e, u);
                if (n) {
                    r = ct(e), i = ct(u);
                    for (o = 0; r[o]; ++o) ft(r[o], i[o])
                }
            }
            return r = i = null, u
        },
        clean: function(e, t, r, i) {
            var o, u, a, f = [];
            t = t || n, typeof t.createElement == "undefined" && (t = t.ownerDocument || t[0] && t[0].ownerDocument || n);
            for (var l = 0, c;
                (c = e[l]) != null; l++) {
                typeof c == "number" && (c += "");
                if (!c) continue;
                if (typeof c == "string")
                    if (!Z.test(c)) c = t.createTextNode(c);
                    else {
                        c = c.replace(Q, "<$1></$2>");
                        var h = (G.exec(c) || ["", ""])[1].toLowerCase(),
                            p = ot[h] || ot._default,
                            d = p[0],
                            v = t.createElement("div"),
                            m = ut.childNodes,
                            g;
                        t === n ? ut.appendChild(v) : V(t).appendChild(v), v.innerHTML = p[1] + c + p[2];
                        while (d--) v = v.lastChild;
                        if (!s.support.tbody) {
                            var y = Y.test(c),
                                b = h === "table" && !y ? v.firstChild && v.firstChild.childNodes : p[1] === "<table>" && !y ? v.childNodes : [];
                            for (a = b.length - 1; a >= 0; --a) s.nodeName(b[a], "tbody") && !b[a].childNodes.length && b[a].parentNode.removeChild(b[a])
                        }!s.support.leadingWhitespace && K.test(c) && v.insertBefore(t.createTextNode(K.exec(c)[0]), v.firstChild), c = v.childNodes, v && (v.parentNode.removeChild(v), m.length > 0 && (g = m[m.length - 1], g && g.parentNode && g.parentNode.removeChild(g)))
                    }
                var w;
                if (!s.support.appendChecked)
                    if (c[0] && typeof(w = c.length) == "number")
                        for (a = 0; a < w; a++) pt(c[a]);
                    else pt(c);
                c.nodeType ? f.push(c) : f = s.merge(f, c)
            }
            if (r) {
                o = function(e) {
                    return !e.type || it.test(e.type)
                };
                for (l = 0; f[l]; l++) {
                    u = f[l];
                    if (i && s.nodeName(u, "script") && (!u.type || it.test(u.type))) i.push(u.parentNode ? u.parentNode.removeChild(u) : u);
                    else {
                        if (u.nodeType === 1) {
                            var E = s.grep(u.getElementsByTagName("script"), o);
                            f.splice.apply(f, [l + 1, 0].concat(E))
                        }
                        r.appendChild(u)
                    }
                }
            }
            return f
        },
        cleanData: function(e) {
            var t, n, r = s.cache,
                i = s.event.special,
                o = s.support.deleteExpando;
            for (var u = 0, a;
                (a = e[u]) != null; u++) {
                if (a.nodeName && s.noData[a.nodeName.toLowerCase()]) continue;
                n = a[s.expando];
                if (n) {
                    t = r[n];
                    if (t && t.events) {
                        for (var f in t.events) i[f] ? s.event.remove(a, f) : s.removeEvent(a, f, t.handle);
                        t.handle && (t.handle.elem = null)
                    }
                    o ? delete a[s.expando] : a.removeAttribute && a.removeAttribute(s.expando), delete r[n]
                }
            }
        }
    });
    var vt = /alpha\([^)]*\)/i,
        mt = /opacity=([^)]*)/,
        gt = /([A-Z]|^ms)/g,
        yt = /^[\-+]?(?:\d*\.)?\d+$/i,
        bt = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
        wt = /^([\-+])=([\-+.\de]+)/,
        Et = /^margin/,
        St = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        xt = ["Top", "Right", "Bottom", "Left"],
        Tt, Nt, Ct;
    s.fn.css = function(e, n) {
        return s.access(this, function(e, n, r) {
            return r !== t ? s.style(e, n, r) : s.css(e, n)
        }, e, n, arguments.length > 1)
    }, s.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = Tt(e, "opacity");
                        return n === "" ? "1" : n
                    }
                    return e.style.opacity
                }
            }
        },
        cssNumber: {
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": s.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(e, n, r, i) {
            if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style) return;
            var o, u, a = s.camelCase(n),
                f = e.style,
                l = s.cssHooks[a];
            n = s.cssProps[a] || a;
            if (r === t) return l && "get" in l && (o = l.get(e, !1, i)) !== t ? o : f[n];
            u = typeof r, u === "string" && (o = wt.exec(r)) && (r = +(o[1] + 1) * +o[2] + parseFloat(s.css(e, n)), u = "number");
            if (r == null || u === "number" && isNaN(r)) return;
            u === "number" && !s.cssNumber[a] && (r += "px");
            if (!l || !("set" in l) || (r = l.set(e, r)) !== t) try {
                f[n] = r
            } catch (c) {}
        },
        css: function(e, n, r) {
            var i, o;
            n = s.camelCase(n), o = s.cssHooks[n], n = s.cssProps[n] || n, n === "cssFloat" && (n = "float");
            if (o && "get" in o && (i = o.get(e, !0, r)) !== t) return i;
            if (Tt) return Tt(e, n)
        },
        swap: function(e, t, n) {
            var r = {},
                i, s;
            for (s in t) r[s] = e.style[s], e.style[s] = t[s];
            i = n.call(e);
            for (s in t) e.style[s] = r[s];
            return i
        }
    }), s.curCSS = s.css, n.defaultView && n.defaultView.getComputedStyle && (Nt = function(e, t) {
        var n, r, i, o, u = e.style;
        return t = t.replace(gt, "-$1").toLowerCase(), (r = e.ownerDocument.defaultView) && (i = r.getComputedStyle(e, null)) && (n = i.getPropertyValue(t), n === "" && !s.contains(e.ownerDocument.documentElement, e) && (n = s.style(e, t))), !s.support.pixelMargin && i && Et.test(t) && bt.test(n) && (o = u.width, u.width = n, n = i.width, u.width = o), n
    }), n.documentElement.currentStyle && (Ct = function(e, t) {
        var n, r, i, s = e.currentStyle && e.currentStyle[t],
            o = e.style;
        return s == null && o && (i = o[t]) && (s = i), bt.test(s) && (n = o.left, r = e.runtimeStyle && e.runtimeStyle.left, r && (e.runtimeStyle.left = e.currentStyle.left), o.left = t === "fontSize" ? "1em" : s, s = o.pixelLeft + "px", o.left = n, r && (e.runtimeStyle.left = r)), s === "" ? "auto" : s
    }), Tt = Nt || Ct, s.each(["height", "width"], function(e, t) {
        s.cssHooks[t] = {
            get: function(e, n, r) {
                if (n) return e.offsetWidth !== 0 ? kt(e, t, r) : s.swap(e, St, function() {
                    return kt(e, t, r)
                })
            },
            set: function(e, t) {
                return yt.test(t) ? t + "px" : t
            }
        }
    }), s.support.opacity || (s.cssHooks.opacity = {
        get: function(e, t) {
            return mt.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : t ? "1" : ""
        },
        set: function(e, t) {
            var n = e.style,
                r = e.currentStyle,
                i = s.isNumeric(t) ? "alpha(opacity=" + t * 100 + ")" : "",
                o = r && r.filter || n.filter || "";
            n.zoom = 1;
            if (t >= 1 && s.trim(o.replace(vt, "")) === "") {
                n.removeAttribute("filter");
                if (r && !r.filter) return
            }
            n.filter = vt.test(o) ? o.replace(vt, i) : o + " " + i
        }
    }), s(function() {
        s.support.reliableMarginRight || (s.cssHooks.marginRight = {
            get: function(e, t) {
                return s.swap(e, {
                    display: "inline-block"
                }, function() {
                    return t ? Tt(e, "margin-right") : e.style.marginRight
                })
            }
        })
    }), s.expr && s.expr.filters && (s.expr.filters.hidden = function(e) {
        var t = e.offsetWidth,
            n = e.offsetHeight;
        return t === 0 && n === 0 || !s.support.reliableHiddenOffsets && (e.style && e.style.display || s.css(e, "display")) === "none"
    }, s.expr.filters.visible = function(e) {
        return !s.expr.filters.hidden(e)
    }), s.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        s.cssHooks[e + t] = {
            expand: function(n) {
                var r, i = typeof n == "string" ? n.split(" ") : [n],
                    s = {};
                for (r = 0; r < 4; r++) s[e + xt[r] + t] = i[r] || i[r - 2] || i[0];
                return s
            }
        }
    });
    var Lt = /%20/g,
        At = /\[\]$/,
        Ot = /\r?\n/g,
        Mt = /#.*$/,
        _t = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
        Dt = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        Pt = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        Ht = /^(?:GET|HEAD)$/,
        Bt = /^\/\//,
        jt = /\?/,
        Ft = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        It = /^(?:select|textarea)/i,
        qt = /\s+/,
        Rt = /([?&])_=[^&]*/,
        Ut = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
        zt = s.fn.load,
        Wt = {},
        Xt = {},
        Vt, $t, Jt = ["*/"] + ["*"];
    try {
        Vt = i.href
    } catch (Kt) {
        Vt = n.createElement("a"), Vt.href = "", Vt = Vt.href
    }
    $t = Ut.exec(Vt.toLowerCase()) || [], s.fn.extend({
        load: function(e, n, r) {
            if (typeof e != "string" && zt) return zt.apply(this, arguments);
            if (!this.length) return this;
            var i = e.indexOf(" ");
            if (i >= 0) {
                var o = e.slice(i, e.length);
                e = e.slice(0, i)
            }
            var u = "GET";
            n && (s.isFunction(n) ? (r = n, n = t) : typeof n == "object" && (n = s.param(n, s.ajaxSettings.traditional), u = "POST"));
            var a = this;
            return s.ajax({
                url: e,
                type: u,
                dataType: "html",
                data: n,
                complete: function(e, t, n) {
                    n = e.responseText, e.isResolved() && (e.done(function(e) {
                        n = e
                    }), a.html(o ? s("<div>").append(n.replace(Ft, "")).find(o) : n)), r && a.each(r, [n, t, e])
                }
            }), this
        },
        serialize: function() {
            return s.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                return this.elements ? s.makeArray(this.elements) : this
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || It.test(this.nodeName) || Dt.test(this.type))
            }).map(function(e, t) {
                var n = s(this).val();
                return n == null ? null : s.isArray(n) ? s.map(n, function(e, n) {
                    return {
                        name: t.name,
                        value: e.replace(Ot, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Ot, "\r\n")
                }
            }).get()
        }
    }), s.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(e, t) {
        s.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), s.each(["get", "post"], function(e, n) {
        s[n] = function(e, r, i, o) {
            return s.isFunction(r) && (o = o || i, i = r, r = t), s.ajax({
                type: n,
                url: e,
                data: r,
                success: i,
                dataType: o
            })
        }
    }), s.extend({
        getScript: function(e, n) {
            return s.get(e, t, n, "script")
        },
        getJSON: function(e, t, n) {
            return s.get(e, t, n, "json")
        },
        ajaxSetup: function(e, t) {
            return t ? Yt(e, s.ajaxSettings) : (t = e, e = s.ajaxSettings), Yt(e, t), e
        },
        ajaxSettings: {
            url: Vt,
            isLocal: Pt.test($t[1]),
            global: !0,
            type: "GET",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            processData: !0,
            async: !0,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": Jt
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },
            converters: {
                "* text": e.String,
                "text html": !0,
                "text json": s.parseJSON,
                "text xml": s.parseXML
            },
            flatOptions: {
                context: !0,
                url: !0
            }
        },
        ajaxPrefilter: Qt(Wt),
        ajaxTransport: Qt(Xt),
        ajax: function(e, n) {
            function S(e, n, c, h) {
                if (y === 2) return;
                y = 2, m && clearTimeout(m), v = t, p = h || "", E.readyState = e > 0 ? 4 : 0;
                var d, g, w, S = n,
                    x = c ? en(r, E, c) : t,
                    T, N;
                if (e >= 200 && e < 300 || e === 304) {
                    if (r.ifModified) {
                        if (T = E.getResponseHeader("Last-Modified")) s.lastModified[l] = T;
                        if (N = E.getResponseHeader("Etag")) s.etag[l] = N
                    }
                    if (e === 304) S = "notmodified", d = !0;
                    else try {
                        g = tn(r, x), S = "success", d = !0
                    } catch (C) {
                        S = "parsererror", w = C
                    }
                } else {
                    w = S;
                    if (!S || e) S = "error", e < 0 && (e = 0)
                }
                E.status = e, E.statusText = "" + (n || S), d ? u.resolveWith(i, [g, S, E]) : u.rejectWith(i, [E, S, w]), E.statusCode(f), f = t, b && o.trigger("ajax" + (d ? "Success" : "Error"), [E, r, d ? g : w]), a.fireWith(i, [E, S]), b && (o.trigger("ajaxComplete", [E, r]), --s.active || s.event.trigger("ajaxStop"))
            }
            typeof e == "object" && (n = e, e = t), n = n || {};
            var r = s.ajaxSetup({}, n),
                i = r.context || r,
                o = i !== r && (i.nodeType || i instanceof s) ? s(i) : s.event,
                u = s.Deferred(),
                a = s.Callbacks("once memory"),
                f = r.statusCode || {},
                l, c = {},
                h = {},
                p, d, v, m, g, y = 0,
                b, w, E = {
                    readyState: 0,
                    setRequestHeader: function(e, t) {
                        if (!y) {
                            var n = e.toLowerCase();
                            e = h[n] = h[n] || e, c[e] = t
                        }
                        return this
                    },
                    getAllResponseHeaders: function() {
                        return y === 2 ? p : null
                    },
                    getResponseHeader: function(e) {
                        var n;
                        if (y === 2) {
                            if (!d) {
                                d = {};
                                while (n = _t.exec(p)) d[n[1].toLowerCase()] = n[2]
                            }
                            n = d[e.toLowerCase()]
                        }
                        return n === t ? null : n
                    },
                    overrideMimeType: function(e) {
                        return y || (r.mimeType = e), this
                    },
                    abort: function(e) {
                        return e = e || "abort", v && v.abort(e), S(0, e), this
                    }
                };
            u.promise(E), E.success = E.done, E.error = E.fail, E.complete = a.add, E.statusCode = function(e) {
                if (e) {
                    var t;
                    if (y < 2)
                        for (t in e) f[t] = [f[t], e[t]];
                    else t = e[E.status], E.then(t, t)
                }
                return this
            }, r.url = ((e || r.url) + "").replace(Mt, "").replace(Bt, $t[1] + "//"), r.dataTypes = s.trim(r.dataType || "*").toLowerCase().split(qt), r.crossDomain == null && (g = Ut.exec(r.url.toLowerCase()), r.crossDomain = !(!g || g[1] == $t[1] && g[2] == $t[2] && (g[3] || (g[1] === "http:" ? 80 : 443)) == ($t[3] || ($t[1] === "http:" ? 80 : 443)))), r.data && r.processData && typeof r.data != "string" && (r.data = s.param(r.data, r.traditional)), Gt(Wt, r, n, E);
            if (y === 2) return !1;
            b = r.global, r.type = r.type.toUpperCase(), r.hasContent = !Ht.test(r.type), b && s.active++ === 0 && s.event.trigger("ajaxStart");
            if (!r.hasContent) {
                r.data && (r.url += (jt.test(r.url) ? "&" : "?") + r.data, delete r.data), l = r.url;
                if (r.cache === !1) {
                    var x = s.now(),
                        T = r.url
                        .replace(Rt, "$1_=" + x);
                    r.url = T + (T === r.url ? (jt.test(r.url) ? "&" : "?") + "_=" + x : "")
                }
            }(r.data && r.hasContent && r.contentType !== !1 || n.contentType) && E.setRequestHeader("Content-Type", r.contentType), r.ifModified && (l = l || r.url, s.lastModified[l] && E.setRequestHeader("If-Modified-Since", s.lastModified[l]), s.etag[l] && E.setRequestHeader("If-None-Match", s.etag[l])), E.setRequestHeader("Accept", r.dataTypes[0] && r.accepts[r.dataTypes[0]] ? r.accepts[r.dataTypes[0]] + (r.dataTypes[0] !== "*" ? ", " + Jt + "; q=0.01" : "") : r.accepts["*"]);
            for (w in r.headers) E.setRequestHeader(w, r.headers[w]);
            if (!r.beforeSend || r.beforeSend.call(i, E, r) !== !1 && y !== 2) {
                for (w in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) E[w](r[w]);
                v = Gt(Xt, r, n, E);
                if (!v) S(-1, "No Transport");
                else {
                    E.readyState = 1, b && o.trigger("ajaxSend", [E, r]), r.async && r.timeout > 0 && (m = setTimeout(function() {
                        E.abort("timeout")
                    }, r.timeout));
                    try {
                        y = 1, v.send(c, S)
                    } catch (N) {
                        if (!(y < 2)) throw N;
                        S(-1, N)
                    }
                }
                return E
            }
            return E.abort(), !1
        },
        param: function(e, n) {
            var r = [],
                i = function(e, t) {
                    t = s.isFunction(t) ? t() : t, r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
                };
            n === t && (n = s.ajaxSettings.traditional);
            if (s.isArray(e) || e.jquery && !s.isPlainObject(e)) s.each(e, function() {
                i(this.name, this.value)
            });
            else
                for (var o in e) Zt(o, e[o], n, i);
            return r.join("&").replace(Lt, "+")
        }
    }), s.extend({
        active: 0,
        lastModified: {},
        etag: {}
    });
    var nn = s.now(),
        rn = /(\=)\?(&|$)|\?\?/i;
    s.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            return s.expando + "_" + nn++
        }
    }), s.ajaxPrefilter("json jsonp", function(t, n, r) {
        var i = typeof t.data == "string" && /^application\/x\-www\-form\-urlencoded/.test(t.contentType);
        if (t.dataTypes[0] === "jsonp" || t.jsonp !== !1 && (rn.test(t.url) || i && rn.test(t.data))) {
            var o, u = t.jsonpCallback = s.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback,
                a = e[u],
                f = t.url,
                l = t.data,
                c = "$1" + u + "$2";
            return t.jsonp !== !1 && (f = f.replace(rn, c), t.url === f && (i && (l = l.replace(rn, c)), t.data === l && (f += (/\?/.test(f) ? "&" : "?") + t.jsonp + "=" + u))), t.url = f, t.data = l, e[u] = function(e) {
                o = [e]
            }, r.always(function() {
                e[u] = a, o && s.isFunction(a) && e[u](o[0])
            }), t.converters["script json"] = function() {
                return o || s.error(u + " was not called"), o[0]
            }, t.dataTypes[0] = "json", "script"
        }
    }), s.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function(e) {
                return s.globalEval(e), e
            }
        }
    }), s.ajaxPrefilter("script", function(e) {
        e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), s.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var r, i = n.head || n.getElementsByTagName("head")[0] || n.documentElement;
            return {
                send: function(s, o) {
                    r = n.createElement("script"), r.async = "async", e.scriptCharset && (r.charset = e.scriptCharset), r.src = e.url, r.onload = r.onreadystatechange = function(e, n) {
                        if (n || !r.readyState || /loaded|complete/.test(r.readyState)) r.onload = r.onreadystatechange = null, i && r.parentNode && i.removeChild(r), r = t, n || o(200, "success")
                    }, i.insertBefore(r, i.firstChild)
                },
                abort: function() {
                    r && r.onload(0, 1)
                }
            }
        }
    });
    var sn = e.ActiveXObject ? function() {
            for (var e in un) un[e](0, 1)
        } : !1,
        on = 0,
        un;
    s.ajaxSettings.xhr = e.ActiveXObject ? function() {
        return !this.isLocal && an() || fn()
    } : an,
    function(e) {
        s.extend(s.support, {
            ajax: !!e,
            cors: !!e && "withCredentials" in e
        })
    }(s.ajaxSettings.xhr()), s.support.ajax && s.ajaxTransport(function(n) {
        if (!n.crossDomain || s.support.cors) {
            var r;
            return {
                send: function(i, o) {
                    var u = n.xhr(),
                        a, f;
                    n.username ? u.open(n.type, n.url, n.async, n.username, n.password) : u.open(n.type, n.url, n.async);
                    if (n.xhrFields)
                        for (f in n.xhrFields) u[f] = n.xhrFields[f];
                    n.mimeType && u.overrideMimeType && u.overrideMimeType(n.mimeType), !n.crossDomain && !i["X-Requested-With"] && (i["X-Requested-With"] = "XMLHttpRequest");
                    try {
                        for (f in i) u.setRequestHeader(f, i[f])
                    } catch (l) {}
                    u.send(n.hasContent && n.data || null), r = function(e, i) {
                        var f, l, c, h, p;
                        try {
                            if (r && (i || u.readyState === 4)) {
                                r = t, a && (u.onreadystatechange = s.noop, sn && delete un[a]);
                                if (i) u.readyState !== 4 && u.abort();
                                else {
                                    f = u.status, c = u.getAllResponseHeaders(), h = {}, p = u.responseXML, p && p.documentElement && (h.xml = p);
                                    try {
                                        h.text = u.responseText
                                    } catch (e) {}
                                    try {
                                        l = u.statusText
                                    } catch (d) {
                                        l = ""
                                    }!f && n.isLocal && !n.crossDomain ? f = h.text ? 200 : 404 : f === 1223 && (f = 204)
                                }
                            }
                        } catch (v) {
                            i || o(-1, v)
                        }
                        h && o(f, l, h, c)
                    }, !n.async || u.readyState === 4 ? r() : (a = ++on, sn && (un || (un = {}, s(e).unload(sn)), un[a] = r), u.onreadystatechange = r)
                },
                abort: function() {
                    r && r(0, 1)
                }
            }
        }
    });
    var ln = {},
        cn, hn, pn = /^(?:toggle|show|hide)$/,
        dn = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
        vn, mn = [
            ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
            ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
            ["opacity"]
        ],
        gn;
    s.fn.extend({
        show: function(e, t, n) {
            var r, i;
            if (e || e === 0) return this.animate(wn("show", 3), e, t, n);
            for (var o = 0, u = this.length; o < u; o++) r = this[o], r.style && (i = r.style.display, !s._data(r, "olddisplay") && i === "none" && (i = r.style.display = ""), (i === "" && s.css(r, "display") === "none" || !s.contains(r.ownerDocument.documentElement, r)) && s._data(r, "olddisplay", En(r.nodeName)));
            for (o = 0; o < u; o++) {
                r = this[o];
                if (r.style) {
                    i = r.style.display;
                    if (i === "" || i === "none") r.style.display = s._data(r, "olddisplay") || ""
                }
            }
            return this
        },
        hide: function(e, t, n) {
            if (e || e === 0) return this.animate(wn("hide", 3), e, t, n);
            var r, i, o = 0,
                u = this.length;
            for (; o < u; o++) r = this[o], r.style && (i = s.css(r, "display"), i !== "none" && !s._data(r, "olddisplay") && s._data(r, "olddisplay", i));
            for (o = 0; o < u; o++) this[o].style && (this[o].style.display = "none");
            return this
        },
        _toggle: s.fn.toggle,
        toggle: function(e, t, n) {
            var r = typeof e == "boolean";
            return s.isFunction(e) && s.isFunction(t) ? this._toggle.apply(this, arguments) : e == null || r ? this.each(function() {
                var t = r ? e : s(this).is(":hidden");
                s(this)[t ? "show" : "hide"]()
            }) : this.animate(wn("toggle", 3), e, t, n), this
        },
        fadeTo: function(e, t, n, r) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(e, t, n, r) {
            function o() {
                i.queue === !1 && s._mark(this);
                var t = s.extend({}, i),
                    n = this.nodeType === 1,
                    r = n && s(this).is(":hidden"),
                    o, u, a, f, l, c, h, p, d, v, m;
                t.animatedProperties = {};
                for (a in e) {
                    o = s.camelCase(a), a !== o && (e[o] = e[a], delete e[a]);
                    if ((l = s.cssHooks[o]) && "expand" in l) {
                        c = l.expand(e[o]), delete e[o];
                        for (a in c) a in e || (e[a] = c[a])
                    }
                }
                for (o in e) {
                    u = e[o], s.isArray(u) ? (t.animatedProperties[o] = u[1], u = e[o] = u[0]) : t.animatedProperties[o] = t.specialEasing && t.specialEasing[o] || t.easing || "swing";
                    if (u === "hide" && r || u === "show" && !r) return t.complete.call(this);
                    n && (o === "height" || o === "width") && (t.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], s.css(this, "display") === "inline" && s.css(this, "float") === "none" && (!s.support.inlineBlockNeedsLayout || En(this.nodeName) === "inline" ? this.style.display = "inline-block" : this.style.zoom = 1))
                }
                t.overflow != null && (this.style.overflow = "hidden");
                for (a in e) f = new s.fx(this, t, a), u = e[a], pn.test(u) ? (m = s._data(this, "toggle" + a) || (u === "toggle" ? r ? "show" : "hide" : 0), m ? (s._data(this, "toggle" + a, m === "show" ? "hide" : "show"), f[m]()) : f[u]()) : (h = dn.exec(u), p = f.cur(), h ? (d = parseFloat(h[2]), v = h[3] || (s.cssNumber[a] ? "" : "px"), v !== "px" && (s.style(this, a, (d || 1) + v), p = (d || 1) / f.cur() * p, s.style(this, a, p + v)), h[1] && (d = (h[1] === "-=" ? -1 : 1) * d + p), f.custom(p, d, v)) : f.custom(p, u, ""));
                return !0
            }
            var i = s.speed(t, n, r);
            return s.isEmptyObject(e) ? this.each(i.complete, [!1]) : (e = s.extend({}, e), i.queue === !1 ? this.each(o) : this.queue(i.queue, o))
        },
        stop: function(e, n, r) {
            return typeof e != "string" && (r = n, n = e, e = t), n && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                function u(e, t, n) {
                    var i = t[n];
                    s.removeData(e, n, !0), i.stop(r)
                }
                var t, n = !1,
                    i = s.timers,
                    o = s._data(this);
                r || s._unmark(!0, this);
                if (e == null)
                    for (t in o) o[t] && o[t].stop && t.indexOf(".run") === t.length - 4 && u(this, o, t);
                else o[t = e + ".run"] && o[t].stop && u(this, o, t);
                for (t = i.length; t--;) i[t].elem === this && (e == null || i[t].queue === e) && (r ? i[t](!0) : i[t].saveState(), n = !0, i.splice(t, 1));
                (!r || !n) && s.dequeue(this, e)
            })
        }
    }), s.each({
        slideDown: wn("show", 1),
        slideUp: wn("hide", 1),
        slideToggle: wn("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        s.fn[e] = function(e, n, r) {
            return this.animate(t, e, n, r)
        }
    }), s.extend({
        speed: function(e, t, n) {
            var r = e && typeof e == "object" ? s.extend({}, e) : {
                complete: n || !n && t || s.isFunction(e) && e,
                duration: e,
                easing: n && t || t && !s.isFunction(t) && t
            };
            r.duration = s.fx.off ? 0 : typeof r.duration == "number" ? r.duration : r.duration in s.fx.speeds ? s.fx.speeds[r.duration] : s.fx.speeds._default;
            if (r.queue == null || r.queue === !0) r.queue = "fx";
            return r.old = r.complete, r.complete = function(e) {
                s.isFunction(r.old) && r.old.call(this), r.queue ? s.dequeue(this, r.queue) : e !== !1 && s._unmark(this)
            }, r
        },
        easing: {
            linear: function(e) {
                return e
            },
            swing: function(e) {
                return -Math.cos(e * Math.PI) / 2 + .5
            }
        },
        timers: [],
        fx: function(e, t, n) {
            this.options = t, this.elem = e, this.prop = n, t.orig = t.orig || {}
        }
    }), s.fx.prototype = {
        update: function() {
            this.options.step && this.options.step.call(this.elem, this.now, this), (s.fx.step[this.prop] || s.fx.step._default)(this)
        },
        cur: function() {
            if (this.elem[this.prop] == null || !!this.elem.style && this.elem.style[this.prop] != null) {
                var e, t = s.css(this.elem, this.prop);
                return isNaN(e = parseFloat(t)) ? !t || t === "auto" ? 0 : t : e
            }
            return this.elem[this.prop]
        },
        custom: function(e, n, r) {
            function u(e) {
                return i.step(e)
            }
            var i = this,
                o = s.fx;
            this.startTime = gn || yn(), this.end = n, this.now = this.start = e, this.pos = this.state = 0, this.unit = r || this.unit || (s.cssNumber[this.prop] ? "" : "px"), u.queue = this.options.queue, u.elem = this.elem, u.saveState = function() {
                s._data(i.elem, "fxshow" + i.prop) === t && (i.options.hide ? s._data(i.elem, "fxshow" + i.prop, i.start) : i.options.show && s._data(i.elem, "fxshow" + i.prop, i.end))
            }, u() && s.timers.push(u) && !vn && (vn = setInterval(o.tick, o.interval))
        },
        show: function() {
            var e = s._data(this.elem, "fxshow" + this.prop);
            this.options.orig[this.prop] = e || s.style(this.elem, this.prop), this.options.show = !0, e !== t ? this.custom(this.cur(), e) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur()), s(this.elem).show()
        },
        hide: function() {
            this.options.orig[this.prop] = s._data(this.elem, "fxshow" + this.prop) || s.style(this.elem, this.prop), this.options.hide = !0, this.custom(this.cur(), 0)
        },
        step: function(e) {
            var t, n, r, i = gn || yn(),
                o = !0,
                u = this.elem,
                a = this.options;
            if (e || i >= a.duration + this.startTime) {
                this.now = this.end, this.pos = this.state = 1, this.update(), a.animatedProperties[this.prop] = !0;
                for (t in a.animatedProperties) a.animatedProperties[t] !== !0 && (o = !1);
                if (o) {
                    a.overflow != null && !s.support.shrinkWrapBlocks && s.each(["", "X", "Y"], function(e, t) {
                        u.style["overflow" + t] = a.overflow[e]
                    }), a.hide && s(u).hide();
                    if (a.hide || a.show)
                        for (t in a.animatedProperties) s.style(u, t, a.orig[t]), s.removeData(u, "fxshow" + t, !0), s.removeData(u, "toggle" + t, !0);
                    r = a.complete, r && (a.complete = !1, r.call(u))
                }
                return !1
            }
            return a.duration == Infinity ? this.now = i : (n = i - this.startTime, this.state = n / a.duration, this.pos = s.easing[a.animatedProperties[this.prop]](this.state, n, 0, 1, a.duration), this.now = this.start + (this.end - this.start) * this.pos), this.update(), !0
        }
    }, s.extend(s.fx, {
        tick: function() {
            var e, t = s.timers,
                n = 0;
            for (; n < t.length; n++) e = t[n], !e() && t[n] === e && t.splice(n--, 1);
            t.length || s.fx.stop()
        },
        interval: 13,
        stop: function() {
            clearInterval(vn), vn = null
        },
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function(e) {
                s.style(e.elem, "opacity", e.now)
            },
            _default: function(e) {
                e.elem.style && e.elem.style[e.prop] != null ? e.elem.style[e.prop] = e.now + e.unit : e.elem[e.prop] = e.now
            }
        }
    }), s.each(mn.concat.apply([], mn), function(e, t) {
        t.indexOf("margin") && (s.fx.step[t] = function(e) {
            s.style(e.elem, t, Math.max(0, e.now) + e.unit)
        })
    }), s.expr && s.expr.filters && (s.expr.filters.animated = function(e) {
        return s.grep(s.timers, function(t) {
            return e === t.elem
        }).length
    });
    var Sn, xn = /^t(?:able|d|h)$/i,
        Tn = /^(?:body|html)$/i;
    "getBoundingClientRect" in n.documentElement ? Sn = function(e, t, n, r) {
        try {
            r = e.getBoundingClientRect()
        } catch (i) {}
        if (!r || !s.contains(n, e)) return r ? {
            top: r.top,
            left: r.left
        } : {
            top: 0,
            left: 0
        };
        var o = t.body,
            u = Nn(t),
            a = n.clientTop || o.clientTop || 0,
            f = n.clientLeft || o.clientLeft || 0,
            l = u.pageYOffset || s.support.boxModel && n.scrollTop || o.scrollTop,
            c = u.pageXOffset || s.support.boxModel && n.scrollLeft || o.scrollLeft,
            h = r.top + l - a,
            p = r.left + c - f;
        return {
            top: h,
            left: p
        }
    } : Sn = function(e, t, n) {
        var r, i = e.offsetParent,
            o = e,
            u = t.body,
            a = t.defaultView,
            f = a ? a.getComputedStyle(e, null) : e.currentStyle,
            l = e.offsetTop,
            c = e.offsetLeft;
        while ((e = e.parentNode) && e !== u && e !== n) {
            if (s.support.fixedPosition && f.position === "fixed") break;
            r = a ? a.getComputedStyle(e, null) : e.currentStyle, l -= e.scrollTop, c -= e.scrollLeft, e === i && (l += e.offsetTop, c += e.offsetLeft, s.support.doesNotAddBorder && (!s.support.doesAddBorderForTableAndCells || !xn.test(e.nodeName)) && (l += parseFloat(r.borderTopWidth) || 0, c += parseFloat(r.borderLeftWidth) || 0), o = i, i = e.offsetParent), s.support.subtractsBorderForOverflowNotVisible && r.overflow !== "visible" && (l += parseFloat(r.borderTopWidth) || 0, c += parseFloat(r.borderLeftWidth) || 0), f = r
        }
        if (f.position === "relative" || f.position === "static") l += u.offsetTop, c += u.offsetLeft;
        return s.support.fixedPosition && f.position === "fixed" && (l += Math.max(n.scrollTop, u.scrollTop), c += Math.max(n.scrollLeft, u.scrollLeft)), {
            top: l,
            left: c
        }
    }, s.fn.offset = function(e) {
        if (arguments.length) return e === t ? this : this.each(function(t) {
            s.offset.setOffset(this, e, t)
        });
        var n = this[0],
            r = n && n.ownerDocument;
        return r ? n === r.body ? s.offset.bodyOffset(n) : Sn(n, r, r.documentElement) : null
    }, s.offset = {
        bodyOffset: function(e) {
            var t = e.offsetTop,
                n = e.offsetLeft;
            return s.support.doesNotIncludeMarginInBodyOffset && (t += parseFloat(s.css(e, "marginTop")) || 0, n += parseFloat(s.css(e, "marginLeft")) || 0), {
                top: t,
                left: n
            }
        },
        setOffset: function(e, t, n) {
            var r = s.css(e, "position");
            r === "static" && (e.style.position = "relative");
            var i = s(e),
                o = i.offset(),
                u = s.css(e, "top"),
                a = s.css(e, "left"),
                f = (r === "absolute" || r === "fixed") && s.inArray("auto", [u, a]) > -1,
                l = {},
                c = {},
                h, p;
            f ? (c = i.position(), h = c.top, p = c.left) : (h = parseFloat(u) || 0, p = parseFloat(a) || 0), s.isFunction(t) && (t = t.call(e, n, o)), t.top != null && (l.top = t.top - o.top + h), t.left != null && (l.left = t.left - o.left + p), "using" in t ? t.using.call(e, l) : i.css(l)
        }
    }, s.fn.extend({
        position: function() {
            if (!this[0]) return null;
            var e = this[0],
                t = this.offsetParent(),
                n = this.offset(),
                r = Tn.test(t[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : t.offset();
            return n.top -= parseFloat(s.css(e, "marginTop")) || 0, n.left -= parseFloat(s.css(e, "marginLeft")) || 0, r.top += parseFloat(s.css(t[0], "borderTopWidth")) || 0, r.left += parseFloat(s.css(t[0], "borderLeftWidth")) || 0, {
                top: n.top - r.top,
                left: n.left - r.left
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var e = this.offsetParent || n.body;
                while (e && !Tn.test(e.nodeName) && s.css(e, "position") === "static") e = e.offsetParent;
                return e
            })
        }
    }), s.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, n) {
        var r = /Y/.test(n);
        s.fn[e] = function(i) {
            return s.access(this, function(e, i, o) {
                var u = Nn(e);
                if (o === t) return u ? n in u ? u[n] : s.support.boxModel && u.document.documentElement[i] || u.document.body[i] : e[i];
                u ? u.scrollTo(r ? s(u).scrollLeft() : o, r ? o : s(u).scrollTop()) : e[i] = o
            }, e, i, arguments.length, null)
        }
    }), s.each({
        Height: "height",
        Width: "width"
    }, function(e, n) {
        var r = "client" + e,
            i = "scroll" + e,
            o = "offset" + e;
        s.fn["inner" + e] = function() {
            var e = this[0];
            return e ? e.style ? parseFloat(s.css(e, n, "padding")) : this[n]() : null
        }, s.fn["outer" + e] = function(e) {
            var t = this[0];
            return t ? t.style ? parseFloat(s.css(t, n, e ? "margin" : "border")) : this[n]() : null
        }, s.fn[n] = function(e) {
            return s.access(this, function(e, n, u) {
                var a, f, l, c;
                if (s.isWindow(e)) return a = e.document, f = a.documentElement[r], s.support.boxModel && f || a.body && a.body[r] || f;
                if (e.nodeType === 9) return a = e.documentElement, a[r] >= a[i] ? a[r] : Math.max(e.body[i], a[i], e.body[o], a[o]);
                if (u === t) return l = s.css(e, n), c = parseFloat(l), s.isNumeric(c) ? c : l;
                s(e).css(n, u)
            }, n, e, arguments.length, null)
        }
    }), e.jQuery = e.$ = s, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function() {
        return s
    })
}(window),
function(e, t) {
    var n;
    e.rails = n = {
        linkClickSelector: "a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]",
        inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
        formSubmitSelector: "form",
        formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not(button[type])",
        disableSelector: "input[data-disable-with], button[data-disable-with], textarea[data-disable-with]",
        enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled",
        requiredInputSelector: "input[name][required]:not([disabled]),textarea[name][required]:not([disabled])",
        fileInputSelector: "input:file",
        linkDisableSelector: "a[data-disable-with]",
        CSRFProtection: function(t) {
            var n = e('meta[name="csrf-token"]').attr("content");
            n && t.setRequestHeader("X-CSRF-Token", n)
        },
        fire: function(t, n, r) {
            var i = e.Event(n);
            return t.trigger(i, r), i.result !== !1
        },
        confirm: function(e) {
            return confirm(e)
        },
        ajax: function(t) {
            return e.ajax(t)
        },
        href: function(e) {
            return e.attr("href")
        },
        handleRemote: function(r) {
            var i, s, o, u, a, f;
            if (n.fire(r, "ajax:before")) {
                u = r.data("cross-domain") || null, a = r.data("type") || e.ajaxSettings && e.ajaxSettings.dataType;
                if (r.is("form")) {
                    i = r.attr("method"), s = r.attr("action"), o = r.serializeArray();
                    var l = r.data("ujs:submit-button");
                    l && (o.push(l), r.data("ujs:submit-button", null))
                } else r.is(n.inputChangeSelector) ? (i = r.data("method"), s = r.data("url"), o = r.serialize(), r.data("params") && (o = o + "&" + r.data("params"))) : (i = r.data("method"), s = n.href(r), o = r.data("params") || null);
                return f = {
                    type: i || "GET",
                    data: o,
                    dataType: a,
                    crossDomain: u,
                    beforeSend: function(e, i) {
                        return i.dataType === t && e.setRequestHeader("accept", "*/*;q=0.5, " + i.accepts.script), n.fire(r, "ajax:beforeSend", [e, i])
                    },
                    success: function(e, t, n) {
                        r.trigger("ajax:success", [e, t, n])
                    },
                    complete: function(e, t) {
                        r.trigger("ajax:complete", [e, t])
                    },
                    error: function(e, t, n) {
                        r.trigger("ajax:error", [e, t, n])
                    }
                }, s && (f.url = s), n.ajax(f)
            }
            return !1
        },
        handleMethod: function(r) {
            var i = n.href(r),
                s = r.data("method"),
                o = r.attr("target"),
                u = e("meta[name=csrf-token]").attr("content"),
                a = e("meta[name=csrf-param]").attr("content"),
                f = e('<form method="post" action="' + i + '"></form>'),
                l = '<input name="_method" value="' + s + '" type="hidden" />';
            a !== t && u !== t && (l += '<input name="' + a + '" value="' + u + '" type="hidden" />'), o && f.attr("target", o), f.hide().append(l).appendTo("body"), f.submit()
        },
        disableFormElements: function(t) {
            t.find(n.disableSelector).each(function() {
                var t = e(this),
                    n = t.is("button") ? "html" : "val";
                t.data("ujs:enable-with", t[n]()), t[n](t.data("disable-with")), t.prop("disabled", !0)
            })
        },
        enableFormElements: function(t) {
            t.find(n.enableSelector).each(function() {
                var t = e(this),
                    n = t.is("button") ? "html" : "val";
                t.data("ujs:enable-with") && t[n](t.data("ujs:enable-with")), t.prop("disabled", !1)
            })
        },
        allowAction: function(e) {
            var t = e.data("confirm"),
                r = !1,
                i;
            return t ? (n.fire(e, "confirm") && (r = n.confirm(t), i = n.fire(e, "confirm:complete", [r])), r && i) : !0
        },
        blankInputs: function(t, n, r) {
            var i = e(),
                s, o = n || "input,textarea";
            return t.find(o).each(function() {
                s = e(this);
                if (r ? s.val() : !s.val()) i = i.add(s)
            }), i.length ? i : !1
        },
        nonBlankInputs: function(e, t) {
            return n.blankInputs(e, t, !0)
        },
        stopEverything: function(t) {
            return e(t.target).trigger("ujs:everythingStopped"), t.stopImmediatePropagation(), !1
        },
        callFormSubmitBindings: function(n, r) {
            var i = n.data("events"),
                s = !0;
            return i !== t && i.submit !== t && e.each(i.submit, function(e, t) {
                if (typeof t.handler == "function") return s = t.handler(r)
            }), s
        },
        disableElement: function(e) {
            e.data("ujs:enable-with", e.html()), e.html(e.data("disable-with")), e.bind("click.railsDisable", function(e) {
                return n.stopEverything(e)
            })
        },
        enableElement: function(e) {
            e.data("ujs:enable-with") !== t && (e.html(e.data("ujs:enable-with")), e.data("ujs:enable-with", !1)), e.unbind("click.railsDisable")
        }
    }, e.ajaxPrefilter(function(e, t, r) {
        e.crossDomain || n.CSRFProtection(r)
    }), e(document).delegate(n.linkDisableSelector, "ajax:complete", function() {
        n.enableElement(e(this))
    }), e(document).delegate(n.linkClickSelector, "click.rails", function(r) {
        var i = e(this),
            s = i.data("method"),
            o = i.data("params");
        if (!n.allowAction(i)) return n.stopEverything(r);
        i.is(n.linkDisableSelector) && n.disableElement(i);
        if (i.data("remote") !== t) return (r.metaKey || r.ctrlKey) && (!s || s === "GET") && !o ? !0 : (n.handleRemote(i) === !1 && n.enableElement(i), !1);
        if (i.data("method")) return n.handleMethod(i), !1
    }), e(document).delegate(n.inputChangeSelector, "change.rails", function(t) {
        var r = e(this);
        return n.allowAction(r) ? (n.handleRemote(r), !1) : n.stopEverything(t)
    }), e(document).delegate(n.formSubmitSelector, "submit.rails", function(r) {
        var i = e(this),
            s = i.data("remote") !== t,
            o = n.blankInputs(i, n.requiredInputSelector),
            u = n.nonBlankInputs(i, n.fileInputSelector);
        if (!n.allowAction(i)) return n.stopEverything(r);
        if (o && i.attr("novalidate") == t && n.fire(i, "ajax:aborted:required", [o])) return n.stopEverything(r);
        if (s) return u ? n.fire(i, "ajax:aborted:file", [u]) : !e.support.submitBubbles && e().jquery < "1.7" && n.callFormSubmitBindings(i, r) === !1 ? n.stopEverything(r) : (n.handleRemote(i), !1);
        setTimeout(function() {
            n.disableFormElements(i)
        }, 13)
    }), e(document).delegate(n.formInputClickSelector, "click.rails", function(t) {
        var r = e(this);
        if (!n.allowAction(r)) return n.stopEverything(t);
        var i = r.attr("name"),
            s = i ? {
                name: i,
                value: r.val()
            } : null;
        r.closest("form").data("ujs:submit-button", s)
    }), e(document).delegate(n.formSubmitSelector, "ajax:beforeSend.rails", function(t) {
        this == t.target && n.disableFormElements(e(this))
    }), e(document).delegate(n.formSubmitSelector, "ajax:complete.rails", function(t) {
        this == t.target && n.enableFormElements(e(this))
    })
}(jQuery), window.Modernizr = function(e, t, n) {
    function r() {
        c.input = function(e) {
            for (var t = 0, n = e.length; t < n; t++) C[e[t]] = e[t] in y;
            return C
        }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")), c.inputtypes = function(e) {
            for (var r = 0, i, s, o, u = e.length; r < u; r++) y.setAttribute("type", s = e[r]), i = y.type !== "text", i && (y.value = b, y.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(s) && y.style.WebkitAppearance !== n ? (p.appendChild(y), o = t.defaultView, i = o.getComputedStyle && o.getComputedStyle(y, null).WebkitAppearance !== "textfield" && y.offsetHeight !== 0, p.removeChild(y)) : /^(search|tel)$/.test(s) || (/^(url|email)$/.test(s) ? i = y.checkValidity && y.checkValidity() === !1 : /^color$/.test(s) ? (p.appendChild(y), p.offsetWidth, i = y.value != b, p.removeChild(y)) : i = y.value != b)), N[e[r]] = !!i;
            return N
        }("search tel url email datetime date month week time datetime-local number range color".split(" "))
    }

    function i(e, t) {
        var n = e.charAt(0).toUpperCase() + e.substr(1),
            r = (e + " " + S.join(n + " ") + n).split(" ");
        return s(r, t)
    }

    function s(e, t) {
        for (var r in e)
            if (g[e[r]] !== n) return t == "pfx" ? e[r] : !0;
        return !1
    }

    function o(e, t) {
        return !!~("" + e).indexOf(t)
    }

    function u(e, t) {
        return typeof e === t
    }

    function a(e, t) {
        return f(E.join(e + ";") + (t || ""))
    }

    function f(e) {
        g.cssText = e
    }
    var l = "2.0.6",
        c = {},
        h = !0,
        p = t.documentElement,
        d = t.head || t.getElementsByTagName("head")[0],
        v = "modernizr",
        m = t.createElement(v),
        g = m.style,
        y = t.createElement("input"),
        b = ":)",
        w = Object.prototype.toString,
        E = " -webkit- -moz- -o- -ms- -khtml- ".split(" "),
        S = "Webkit Moz O ms Khtml".split(" "),
        x = {
            svg: "http://www.w3.org/2000/svg"
        },
        T = {},
        N = {},
        C = {},
        k = [],
        L = function(e, n, r, i) {
            var s, o, u, a = t.createElement("div");
            if (parseInt(r, 10))
                while (r--) u = t.createElement("div"), u.id = i ? i[r] : v + (r + 1), a.appendChild(u);
            return s = ["&shy;", "<style>", e, "</style>"].join(""), a.id = v, a.innerHTML += s, p.appendChild(a), o = n(a, e), a.parentNode.removeChild(a), !!o
        },
        A = function(t) {
            var n;
            return L("@media " + t + " { #" + v + " { position: absolute; } }", function(t) {
                n = true
            }), n
        },
        O = function() {
            function e(e, i) {
                i = i || t.createElement(r[e] || "div"), e = "on" + e;
                var s = e in i;
                return s || (i.setAttribute || (i = t.createElement("div")), i.setAttribute && i.removeAttribute && (i.setAttribute(e, ""), s = u(i[e], "function"), u(i[e], n) || (i[e] = n), i.removeAttribute(e))), i = null, s
            }
            var r = {
                select: "input",
                change: "input",
                submit: "form",
                reset: "form",
                error: "img",
                load: "img",
                abort: "img"
            };
            return e
        }(),
        M, _ = {}.hasOwnProperty,
        D;
    !u(_, n) && !u(_.call, n) ? D = function(e, t) {
        return _.call(e, t)
    } : D = function(e, t) {
        return t in e && u(e.constructor.prototype[t], n)
    };
    var P = function(n, r) {
        var i = n.join(""),
            s = r.length;
        L(i, function(n, r) {
            var i = t.styleSheets[t.styleSheets.length - 1],
                o = i.cssRules && i.cssRules[0] ? i.cssRules[0].cssText : i.cssText || "",
                u = n.childNodes,
                a = {};
            while (s--) a[u[s].id] = u[s];
            c.touch = "ontouchstart" in e || a.touch.offsetTop === 9, c.csstransforms3d = a.csstransforms3d.offsetLeft === 9, c.generatedcontent = a.generatedcontent.offsetHeight >= 1, c.fontface = /src/i.test(o) && o.indexOf(r.split(" ")[0]) === 0
        }, s, r)
    }(['@font-face {font-family:"font";src:url("https://")}', ["@media (", E.join("touch-enabled),("), v, ")", "{#touch{top:9px;position:absolute}}"].join(""), ["@media (", E.join("transform-3d),("), v, ")", "{#csstransforms3d{left:9px;position:absolute}}"].join(""), ['#generatedcontent:after{content:"', b, '";visibility:hidden}'].join("")], ["fontface", "touch", "csstransforms3d", "generatedcontent"]);
    T.flexbox = function() {
        function e(e, t, n, r) {
            e.style.cssText = E.join(t + ":" + n + ";") + (r || "")
        }

        function n(e, t, n, r) {
            t += ":", e.style.cssText = (t + E.join(n + ";" + t)).slice(0, -t.length) + (r || "")
        }
        var r = t.createElement("div"),
            i = t.createElement("div");
        n(r, "display", "box", "width:42px;padding:0;"), e(i, "box-flex", "1", "width:10px;"), r.appendChild(i), p.appendChild(r);
        var s = i.offsetWidth === 42;
        return r.removeChild(i), p.removeChild(r), s
    }, T.canvas = function() {
        var e = t.createElement("canvas");
        return !!e.getContext && !!e.getContext("2d")
    }, T.canvastext = function() {
        return !!c.canvas && !!u(t.createElement("canvas").getContext("2d").fillText, "function")
    }, T.webgl = function() {
        return !!e.WebGLRenderingContext
    }, T.touch = function() {
        return c.touch
    }, T.geolocation = function() {
        return !!navigator.geolocation
    }, T.postmessage = function() {
        return !!e.postMessage
    }, T.websqldatabase = function() {
        var t = !!e.openDatabase;
        return t
    }, T.indexedDB = function() {
        for (var t = -1, n = S.length; ++t < n;)
            if (e[S[t].toLowerCase() + "IndexedDB"]) return !0;
        return !!e.indexedDB
    }, T.hashchange = function() {
        return O("hashchange", e) && (t.documentMode === n || t.documentMode > 7)
    }, T.history = function() {
        return !!e.history && !!history.pushState
    }, T.draganddrop = function() {
        return O("dragstart") && O("drop")
    }, T.websockets = function() {
        for (var t = -1, n = S.length; ++t < n;)
            if (e[S[t] + "WebSocket"]) return !0;
        return "WebSocket" in e
    }, T.rgba = function() {
        return f("background-color:rgba(150,255,150,.5)"), o(g.backgroundColor, "rgba")
    }, T.hsla = function() {
        return f("background-color:hsla(120,40%,100%,.5)"), o(g.backgroundColor, "rgba") || o(g.backgroundColor, "hsla")
    }, T.multiplebgs = function() {
        return f("background:url(https://),url(https://),red url(https://)"), /(url\s*\(.*?){3}/.test(g.background)
    }, T.backgroundsize = function() {
        return i("backgroundSize")
    }, T.borderimage = function() {
        return i("borderImage")
    }, T.borderradius = function() {
        return i("borderRadius")
    }, T.boxshadow = function() {
        return i("boxShadow")
    }, T.textshadow = function() {
        return t.createElement("div").style.textShadow === ""
    }, T.opacity = function() {
        return a("opacity:.55"), /^0.55$/.test(g.opacity)
    }, T.cssanimations = function() {
        return i("animationName")
    }, T.csscolumns = function() {
        return i("columnCount")
    }, T.cssgradients = function() {
        var e = "background-image:",
            t = "gradient(linear,left top,right bottom,from(#9f9),to(white));",
            n = "linear-gradient(left top,#9f9, white);";
        return f((e + E.join(t + e) + E.join(n + e)).slice(0, -e.length)), o(g.backgroundImage, "gradient")
    }, T.cssreflections = function() {
        return i("boxReflect")
    }, T.csstransforms = function() {
        return !!s(["transformProperty", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])
    }, T.csstransforms3d = function() {
        var e = !!s(["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"]);
        return e && "webkitPerspective" in p.style && (e = c.csstransforms3d), e
    }, T.csstransitions = function() {
        return i("transitionProperty")
    }, T.fontface = function() {
        return c.fontface
    }, T.generatedcontent = function() {
        return c.generatedcontent
    }, T.video = function() {
        var e = t.createElement("video"),
            n = !1;
        try {
            if (n = !!e.canPlayType) {
                n = new Boolean(n), n.ogg = e.canPlayType('video/ogg; codecs="theora"');
                var r = 'video/mp4; codecs="avc1.42E01E';
                n.h264 = e.canPlayType(r + '"') || e.canPlayType(r + ', mp4a.40.2"'), n.webm = e.canPlayType('video/webm; codecs="vp8, vorbis"')
            }
        } catch (i) {}
        return n
    }, T.audio = function() {
        var e = t.createElement("audio"),
            n = !1;
        try {
            if (n = !!e.canPlayType) n = new Boolean(n), n.ogg = e.canPlayType('audio/ogg; codecs="vorbis"'), n.mp3 = e.canPlayType("audio/mpeg;"), n.wav = e.canPlayType('audio/wav; codecs="1"'), n.m4a = e.canPlayType("audio/x-m4a;") || e.canPlayType("audio/aac;")
        } catch (r) {}
        return n
    }, T.localstorage = function() {
        try {
            return !!localStorage.getItem
        } catch (e) {
            return !1
        }
    }, T.sessionstorage = function() {
        try {
            return !!sessionStorage.getItem
        } catch (e) {
            return !1
        }
    }, T.webworkers = function() {
        return !!e.Worker
    }, T.applicationcache = function() {
        return !!e.applicationCache
    }, T.svg = function() {
        return !!t.createElementNS && !!t.createElementNS(x.svg, "svg").createSVGRect
    }, T.inlinesvg = function() {
        var e = t.createElement("div");
        return e.innerHTML = "<svg/>", (e.firstChild && e.firstChild.namespaceURI) == x.svg
    }, T.smil = function() {
        return !!t.createElementNS && /SVG/.test(w.call(t.createElementNS(x.svg, "animate")))
    }, T.svgclippaths = function() {
        return !!t.createElementNS && /SVG/.test(w.call(t.createElementNS(x.svg, "clipPath")))
    };
    for (var H in T) D(T, H) && (M = H.toLowerCase(), c[M] = T[H](), k.push((c[M] ? "" : "no-") + M));
    return c.input || r(), c.addTest = function(e, t) {
        if (typeof e == "object")
            for (var r in e) D(e, r) && c.addTest(r, e[r]);
        else {
            e = e.toLowerCase();
            if (c[e] !== n) return;
            t = typeof t == "boolean" ? t : !!t(), p.className += " " + (t ? "" : "no-") + e, c[e] = t
        }
        return c
    }, f(""), m = y = null, e.attachEvent && function() {
        var e = t.createElement("div");
        return e.innerHTML = "<elem></elem>", e.childNodes.length !== 1
    }() && function(e, t) {
        function r(e) {
            var t = -1;
            while (++t < u) e.createElement(o[t])
        }
        e.iepp = e.iepp || {};
        var i = e.iepp,
            s = i.html5elements || "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
            o = s.split("|"),
            u = o.length,
            a = new RegExp("(^|\\s)(" + s + ")", "gi"),
            f = new RegExp("<(/*)(" + s + ")", "gi"),
            l = /^\s*[\{\}]\s*$/,
            c = new RegExp("(^|[^\\n]*?\\s)(" + s + ")([^\\n]*)({[\\n\\w\\W]*?})", "gi"),
            h = t.createDocumentFragment(),
            p = t.documentElement,
            d = p.firstChild,
            v = t.createElement("body"),
            m = t.createElement("style"),
            g = /print|all/,
            y;
        i.getCSS = function(e, t) {
            if (e + "" === n) return "";
            var r = -1,
                s = e.length,
                o, u = [];
            while (++r < s) {
                o = e[r];
                if (o.disabled) continue;
                t = o.media || t, g.test(t) && u.push(i.getCSS(o.imports, t), o.cssText), t = "all"
            }
            return u.join("")
        }, i.parseCSS = function(e) {
            var t = [],
                n;
            while ((n = c.exec(e)) != null) t.push(((l.exec(n[1]) ? "\n" : n[1]) + n[2] + n[3]).replace(a, "$1.iepp_$2") + n[4]);
            return t.join("\n")
        }, i.writeHTML = function() {
            var e = -1;
            y = y || t.body;
            while (++e < u) {
                var n = t.getElementsByTagName(o[e]),
                    r = n.length,
                    i = -1;
                while (++i < r) n[i].className.indexOf("iepp_") < 0 && (n[i].className += " iepp_" + o[e])
            }
            h.appendChild(y), p.appendChild(v), v.className = y.className, v.id = y.id, v.innerHTML = y.innerHTML.replace(f, "<$1font")
        }, i._beforePrint = function() {
            m.styleSheet.cssText = i.parseCSS(i.getCSS(t.styleSheets, "all")), i.writeHTML()
        }, i.restoreHTML = function() {
            v.innerHTML = "", p.removeChild(v), p.appendChild(y)
        }, i._afterPrint = function() {
            i.restoreHTML(), m.styleSheet.cssText = ""
        }, r(t), r(h), i.disablePP || (d.insertBefore(m, d.firstChild), m.media = "print", m.className = "iepp-printshim", e.attachEvent("onbeforeprint", i._beforePrint), e.attachEvent("onafterprint", i._afterPrint))
    }(e, t), c._version = l, c._prefixes = E, c._domPrefixes = S, c.mq = A, c.hasEvent = O, c.testProp = function(e) {
        return s([e])
    }, c.testAllProps = i, c.testStyles = L, c.prefixed = function(e) {
        return i(e, "pfx")
    }, p.className = p.className.replace(/\bno-js\b/, "") + (h ? " js " + k.join(" ") : ""), c
}(this, this.document),
function(e, t) {
    function n() {
        y(!0)
    }
    e.respond = {}, respond.update = function() {}, respond.mediaQueriesSupported = t;
    if (!t) {
        var r = e.document,
            i = r.documentElement,
            s = [],
            o = [],
            u = [],
            a = {},
            f = 30,
            l = r.getElementsByTagName("head")[0] || i,
            c = l.getElementsByTagName("link"),
            h = [],
            p = function() {
                var t = c,
                    n = t.length,
                    r = 0,
                    i, s, o, u;
                for (; r < n; r++) i = t[r], s = i.href, o = i.media, u = i.rel && i.rel.toLowerCase() === "stylesheet", !!s && u && !a[s] && (!/^([a-zA-Z]+?:(\/\/)?(www\.)?)/.test(s) || s.replace(RegExp.$1, "").split("/")[0] === e.location.host ? h.push({
                    href: s,
                    media: o
                }) : a[s] = !0);
                d()
            },
            d = function() {
                if (h.length) {
                    var e = h.shift();
                    b(e.href, function(t) {
                        v(t, e.href, e.media), a[e.href] = !0, d()
                    })
                }
            },
            v = function(e, t, n) {
                var r = e.match(/@media[^\{]+\{([^\{\}]+\{[^\}\{]+\})+/gi),
                    i = r && r.length || 0,
                    t = t.substring(0, t.lastIndexOf("/")),
                    u = function(e) {
                        return e.replace(/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g, "$1" + t + "$2$3")
                    },
                    a = !i && n,
                    f = 0,
                    l, c, h, p, d;
                t.length && (t += "/"), a && (i = 1);
                for (; f < i; f++) {
                    l = 0, a ? (c = n, o.push(u(e))) : (c = r[f].match(/@media ([^\{]+)\{([\S\s]+?)$/) && RegExp.$1, o.push(RegExp.$2 && u(RegExp.$2))), p = c.split(","), d = p.length;
                    for (; l < d; l++) h = p[l], s.push({
                        media: h.match(/(only\s+)?([a-zA-Z]+)(\sand)?/) && RegExp.$2,
                        rules: o.length - 1,
                        minw: h.match(/\(min\-width:[\s]*([\s]*[0-9]+)px[\s]*\)/) && parseFloat(RegExp.$1),
                        maxw: h.match(/\(max\-width:[\s]*([\s]*[0-9]+)px[\s]*\)/) && parseFloat(RegExp.$1)
                    })
                }
                y()
            },
            m, g, y = function(e) {
                var t = "clientWidth",
                    n = i[t],
                    a = r.compatMode === "CSS1Compat" && n || r.body[t] || n,
                    h = {},
                    p = r.createDocumentFragment(),
                    d = c[c.length - 1],
                    v = (new Date).getTime();
                if (e && m && v - m < f) clearTimeout(g), g = setTimeout(y, f);
                else {
                    m = v;
                    for (var b in s) {
                        var w = s[b];
                        if (!w.minw && !w.maxw || (!w.minw || w.minw && a >= w.minw) && (!w.maxw || w.maxw && a <= w.maxw)) h[w.media] || (h[w.media] = []), h[w.media].push(o[w.rules])
                    }
                    for (var b in u) u[b] && u[b].parentNode === l && l.removeChild(u[b]);
                    for (var b in h) {
                        var E = r.createElement("style"),
                            S = h[b].join("\n");
                        E.type = "text/css", E.media = b, E.styleSheet ? E.styleSheet.cssText = S : E.appendChild(r.createTextNode(S)), p.appendChild(E), u.push(E)
                    }
                    l.insertBefore(p, d.nextSibling)
                }
            },
            b = function(e, t) {
                var n = w();
                if (!!n) {
                    n.open("GET", e, !0), n.onreadystatechange = function() {
                        n.readyState == 4 && (n.status == 200 || n.status == 304) && t(n.responseText)
                    };
                    if (n.readyState == 4) return;
                    n.send()
                }
            },
            w = function() {
                var e = !1,
                    t = [
                        function() {
                            return new ActiveXObject("Microsoft.XMLHTTP")
                        },
                        function() {
                            return new XMLHttpRequest
                        }
                    ],
                    n = t.length;
                while (n--) {
                    try {
                        e = t[n]()
                    } catch (r) {
                        continue
                    }
                    break
                }
                return function() {
                    return e
                }
            }();
        p(), respond.update = p, e.addEventListener ? e.addEventListener("resize", n, !1) : e.attachEvent && e.attachEvent("onresize", n)
    }
}(this, Modernizr.mq("only all")),
function(e, t, n) {
    function r(e) {
        return !e || e == "loaded" || e == "complete"
    }

    function i() {
        var e = 1,
            t = -1;
        while (v.length - ++t)
            if (v[t].s && !(e = v[t].r)) break;
        e && u()
    }

    function s(e) {
        var n = t.createElement("script"),
            s;
        n.src = e.s, n.onreadystatechange = n.onload = function() {
            !s && r(n.readyState) && (s = 1, i(), n.onload = n.onreadystatechange = null)
        }, h(function() {
            s || (s = 1, i())
        }, D.errorTimeout), e.e ? n.onload() : p.parentNode.insertBefore(n, p)
    }

    function o(e) {
        var n = t.createElement("link"),
            r;
        n.href = e.s, n.rel = "stylesheet", n.type = "text/css";
        if (!e.e && (S || g)) {
            var s = function(e) {
                h(function() {
                    if (!r) try {
                        e.sheet.cssRules.length ? (r = 1, i()) : s(e)
                    } catch (t) {
                        t.code == 1e3 || t.message == "security" || t.message == "denied" ? (r = 1, h(function() {
                            i()
                        }, 0)) : s(e)
                    }
                }, 0)
            };
            s(n)
        } else n.onload = function() {
            r || (r = 1, h(function() {
                i()
            }, 0))
        }, e.e && n.onload();
        h(function() {
            r || (r = 1, i())
        }, D.errorTimeout), !e.e && p.parentNode.insertBefore(n, p)
    }

    function u() {
        var e = v.shift();
        m = 1, e ? e.t ? h(function() {
            e.t == "c" ? o(e) : s(e)
        }, 0) : (e(), i()) : m = 0
    }

    function a(e, n, s, o, a, f) {
        function l() {
            !d && r(c.readyState) && (g.r = d = 1, !m && i(), c.onload = c.onreadystatechange = null, h(function() {
                w.removeChild(c)
            }, 0))
        }
        var c = t.createElement(e),
            d = 0,
            g = {
                t: s,
                s: n,
                e: f
            };
        c.src = c.data = n, !y && (c.style.display = "none"), c.width = c.height = "0", e != "object" && (c.type = s), c.onload = c.onreadystatechange = l, e == "img" ? c.onerror = l : e == "script" && (c.onerror = function() {
            g.e = g.r = 1, u()
        }), v.splice(o, 0, g), w.insertBefore(c, y ? null : p), h(function() {
            d || (w.removeChild(c), g.r = g.e = d = 1, i())
        }, D.errorTimeout)
    }

    function f(e, t, n) {
        var r = t == "c" ? N : T;
        return m = 0, t = t || "j", L(e) ? a(r, e, t, this.i++, c, n) : (v.splice(this.i++, 0, e), v.length == 1 && u()), this
    }

    function l() {
        var e = D;
        return e.loader = {
            load: f,
            i: 0
        }, e
    }
    var c = t.documentElement,
        h = e.setTimeout,
        p = t.getElementsByTagName("script")[0],
        d = {}.toString,
        v = [],
        m = 0,
        g = "MozAppearance" in c.style,
        y = g && !!t.createRange().compareNode,
        b = g && !y,
        w = y ? c : p.parentNode,
        E = e.opera && d.call(e.opera) == "[object Opera]",
        S = "webkitAppearance" in c.style,
        x = S && "async" in t.createElement("script"),
        T = g ? "object" : E || x ? "img" : "script",
        N = S ? "img" : T,
        C = Array.isArray || function(e) {
            return d.call(e) == "[object Array]"
        },
        k = function(e) {
            return Object(e) === e
        },
        L = function(e) {
            return typeof e == "string"
        },
        A = function(e) {
            return d.call(e) == "[object Function]"
        },
        O = [],
        M = {},
        _, D;
    D = function(e) {
        function t(e) {
            var t = e.split("!"),
                n = O.length,
                r = t.pop(),
                i = t.length,
                s = {
                    url: r,
                    origUrl: r,
                    prefixes: t
                },
                o, u;
            for (u = 0; u < i; u++) o = M[t[u]], o && (s = o(s));
            for (u = 0; u < n; u++) s = O[u](s);
            return s
        }

        function r(e, r, i, s, o) {
            var u = t(e),
                a = u.autoCallback;
            if (!u.bypass) {
                r && (r = A(r) ? r : r[e] || r[s] || r[e.split("/").pop().split("?")[0]]);
                if (u.instead) return u.instead(e, r, i, s, o);
                i.load(u.url, u.forceCSS || !u.forceJS && /css$/.test(u.url) ? "c" : n, u.noexec), (A(r) || A(a)) && i.load(function() {
                    l(), r && r(u.origUrl, o, s), a && a(u.origUrl, o, s)
                })
            }
        }

        function i(e, t) {
            function n(e) {
                if (L(e)) r(e, u, t, 0, i);
                else if (k(e))
                    for (a in e) e.hasOwnProperty(a) && r(e[a], u, t, a, i)
            }
            var i = !!e.test,
                s = i ? e.yep : e.nope,
                o = e.load || e.both,
                u = e.callback,
                a;
            n(s), n(o), e.complete && t.load(e.complete)
        }
        var s, o, u = this.yepnope.loader;
        if (L(e)) r(e, 0, u, 0);
        else if (C(e))
            for (s = 0; s < e.length; s++) o = e[s], L(o) ? r(o, 0, u, 0) : C(o) ? D(o) : k(o) && i(o, u);
        else k(e) && i(e, u)
    }, D.addPrefix = function(e, t) {
        M[e] = t
    }, D.addFilter = function(e) {
        O.push(e)
    }, D.errorTimeout = 1e4, t.readyState == null && t.addEventListener && (t.readyState = "loading", t.addEventListener("DOMContentLoaded", _ = function() {
        t.removeEventListener("DOMContentLoaded", _, 0), t.readyState = "complete"
    }, 0)), e.yepnope = l()
}(this, this.document), Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0))
};
var chemical = {
        data: {},
        originalChemicalData: {},
        init: function() {
            "use strict";
            var e = this;
            $.extend(e.data, chemData), results.view.generic.loader.show(), e.view.init(e, function() {
                e.model.init(e)
            })
        },
        model: {
            RELATED_RESULT_COUNT: "3",
            init: function(e) {
                "use strict";
                var t = this;
                t.structData.init(e, function() {
                    t.distribution.init(e, function() {
                        t.related.set(e), t.partners.init(e)
                    })
                })
            },
            structData: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = globalData.apiUrl + "/chemical/smiles/" + encodeURIComponent(e.data.structure) + "?auth_token=" + globalData.user.token + global.dev(!0, "&");
                    $.ajax({
                        type: "GET",
                        url: r,
                        dataType: "json",
                        success: function(n) {
                            e.originalChemicalData = n, typeof t != "undefined" && t(), e.view.sidebar.partial.chemInfo.populate.init(n, e)
                        }
                    })
                }
            },
            distribution: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = globalData.apiUrl + "/chemical/smiles/" + encodeURIComponent(e.data.structure) + "/distribution/patents?auth_token=" + globalData.user.token + global.dev(!0, "&");
                    $.ajax({
                        type: "GET",
                        url: r,
                        dataType: "json",
                        success: function(n) {
                            e.view.column.partial.distribution.populate.init(n, e), t()
                        }
                    })
                }
            },
            partners: {
                init: function(e) {
                    "use strict";
                    var t = this;
                    global.external(e.originalChemicalData.data[e.data.structure].inchi_key, function(t) {
                        e.view.sidebar.partial.partners.populate.init(t, e)
                    })
                }
            },
            related: {
                set: function(e) {
                    "use strict";
                    var t = this,
                        n = globalData.apiUrl + "/search/structure",
                        r = {
                            dev: global.dev(!1),
                            child_of: "",
                            auth_token: globalData.user.token,
                            data_source: "PATENTS",
                            save_search: "yes",
                            save_search_label: "",
                            struct: e.data.structure,
                            struct_type: "smiles",
                            result_type: "structures",
                            struct_search_type: "similarity",
                            options: "DISSIMILARITY=0.05",
                            chem_term_filter: "!hasRadical()",
                            query: "",
                            max_hits: e.model.RELATED_RESULT_COUNT
                        };
                    r.search_appendix = t.appendix(r), $.ajax({
                        type: "POST",
                        url: n,
                        dataType: "json",
                        data: r,
                        timeout: 9e4,
                        success: function(t) {
                            e.model.generic.get(t, e)
                        }
                    })
                },
                appendix: function(e) {
                    "use strict";
                    var t = {};
                    return t["struct-input"] = e.struct, t.search_type = {
                        "simil-change": "checked"
                    }, t.authorities = {
                        "authorities-all-annotated": "checked"
                    }, JSON.stringify(t)
                }
            },
            d4s: {
                set: function(e) {
                    "use strict";
                    results.model.set(e.data.structure, "f00f00", results, function(t) {
                        e.data.d4s_hash = t.data.hash, e.model.generic.get(t, e)
                    })
                }
            },
            generic: {
                get: function(e, t) {
                    "use strict";
                    t.data.partialHash = e.data.hash, results.model.get(e.data.hash, "1", results, t.model.RELATED_RESULT_COUNT, function(e) {
                        typeof e.data.query.structure != "undefined" && e.data.query.structure.length > 0 ? t.view.column.partial.tabs.partial.related.populate(e, t) : typeof e.data.query.smiles != "undefined" && e.data.query.smiles.length > 0 && t.view.column.partial.tabs.partial.d4s.populate(e, t)
                    })
                }
            }
        },
        view: {
            init: function(e, t) {
                "use strict";
                var n = this,
                    r = [],
                    i;
                r.push(n.title.init(e)), r.push(n.sidebar.init(e)), r.push(n.column.init(e)), i = n.wrap(r.join("")), $("#chem-target").append(i), e.bind.init(e), global.tooltip(), typeof t != "undefined" && t()
            },
            wrap: function(e) {
                "use strict";
                var t = [];
                return t.push('<div id="chemical-wrapper" class="clear">'), t.push(e), t.push("</div>"), t.join("")
            },
            modal: {
                init: function(e, t, n) {
                    "use strict";
                    var r = [],
                        i = t === !0 ? '<img src="https://direct.surechem.com/service/chemical/image?structure=' + encodeURIComponent(e) + '&structure_hightlight&height=500&width=500" alt="' + e + '" />' : e;
                    r.push('<div id="close-container"><a href="#" id="close-modal" class="tooltip-small" title="Close this modal window">Close</a></div>'), r.push(i), $.modal(r.join(""), {
                        containerCss: {
                            height: 500,
                            padding: 0,
                            width: 500
                        },
                        overlayClose: !0,
                        opacity: 60,
                        overlayCss: {
                            backgroundColor: "#000"
                        },
                        onShow: function() {
                            n.bind.modal(n)
                        }
                    })
                }
            },
            chart: {
                distribution: function(e, t) {
                    "use strict";
                    var n = d3.scale.linear().domain([0, d3.max(t)]).range([0, 560]),
                        r = d3.scale.ordinal().domain(t).rangeBands([0, 180]),
                        i;
                    i = d3.select("#chart-container").append("svg").attr("class", "chart").attr("width", 690).attr("height", 200).append("g").attr("transform", "translate(95,15)"), i.selectAll("line").data(n.ticks(10)).enter().append("line").attr("x1", n).attr("x2", n).attr("y1", 0).attr("y2", 180).style("stroke", "#ccc"), i.selectAll(".rule").data(n.ticks(10)).enter().append("text").attr("x", n).attr("y", 0).attr("dy", -3).attr("text-anchor", "middle").attr("class", "rule-text").text(String), i.selectAll("rect").data(t).enter().append("rect").attr("class", "rect").attr("y", r).attr("width", n).attr("height", r.rangeBand()), i.selectAll(".bar").data(t).enter().append("text").attr("class", "bar").attr("x", n).attr("y", function(e) {
                        return r(e) + r.rangeBand() / 2
                    }).attr("dx", 5).attr("dy", ".35em").attr("text-anchor", "start").text(String), i.selectAll(".keys").data(e).enter().append("text").attr("class", "keys").attr("x", -12).attr("y", function(e) {
                        return r(e) + r.rangeBand() / 2
                    }).attr("dx", 3).attr("dy", ".35em").attr("text-anchor", "end").text(String), i.append("line").attr("y1", 0).attr("y2", 180).style("stroke", "#809449")
                }
            },
            loader: function(e, t, n) {
                "use strict";
                var r = [];
                return r.push('<div class="loader loader-' + e + ' clear" id="loader-' + t.toLowerCase().replace(/ /g, "-") + '">'), r.push('<div class="spinner" id="' + n + '"></div>'), r.push('<p class="title">' + t + "...</p>"), r.push('<p class="des">Loading this data can take a couple of seconds, please reload the page if problems persist</p>'), r.push("</div>"), r.join("")
            },
            title: {
                init: function(e) {
                    "use strict";
                    var t = [];
                    return t.push('<div id="title-container" class="clear">'), t.push('<div class="struct-name">'), t.push("<h1></h1>"), t.push("</div>"), t.push('<div class="corpus-count">'), t.push("<p>Occurences across our corpus</p>"), t.push("<h2></h2>"), t.push("</div>"), t.push("</div>"), t.join("")
                }
            },
            sidebar: {
                init: function(e) {
                    "use strict";
                    var t = this,
                        n = [];
                    return n.push('<div id="chemical-sidebar" class="clear">'), n.push(t.partial.image(206, !0, !0, e)), n.push(t.partial.chemInfo.placeholder()), n.push(t.partial.partners.placeholder()), n.push("</div>"), n.join("")
                },
                partial: {
                    image: function(e, t, n, r) {
                        "use strict";
                        var i = [],
                            s = t === !0 ? "options" : "no-options";
                        return i.push('<div class="image-container ' + s + '">'), i.push('<a href="/' + I18n.locale + "/search/?smiles=" + encodeURIComponent(r.data.structure) + '" class="image-link tooltip-small" title="Click here to start search with this structure">'), i.push('<img src="https://direct.surechem.com/service/chemical/image?structure=' + encodeURIComponent(r.data.structure) + "&structure_hightlight&height=" + e + "&width=" + e + '" alt="' + r.data.structure + '" />'), i.push("</a>"), t === !0 && (i.push('<div class="controls clear">'), i.push('<a href="#" class="enlarge-image" id="size-' + e * 3 + '">Enlarge image</a>'), i.push("</div>")), i.push("</div>"), i.join("")
                    },
                    chemInfo: {
                        placeholder: function() {
                            "use strict";
                            var e = '<div id="chemical-info"></div>';
                            return e
                        },
                        populate: {
                            init: function(e, t) {
                                "use strict";
                                var n = this,
                                    r = [],
                                    i = e.data[t.data.structure],
                                    s = i.mol_weight.toString().split("."),
                                    o = i.log_p.toString().split("."),
                                    u = function(e) {
                                        return e.toString() === "1" ? "Yes" : "No"
                                    };
                                r.push(n.dropDown("SMILES", i.smiles)), r.push(n.dropDown("InChi", i.inchi)), r.push('<div id="table-info" class="clear">'), r.push(n.cell("Mol Weight", s[0] + "." + s[1].substring(0, 3))), r.push(n.cell("Lipinski ROF", u(i.is_lipinski))), r.push(n.cell("Log P", o[0] + "." + o[1].substring(0, 2))), r.push(n.cell("Donor Cnt", i.donor_count)), r.push(n.cell("Ring Cnt", i.ring_count)), r.push(n.cell("Accept Cnt", i.accept_count)), r.push(n.cell("Rotable Bond Cnt", i.rotatable_bond_count)), r.push("</div>"), $("#chemical-info").html(r.join("")), $(".struct-name h1").html(i.name + " <span>Inchi key: " + i.inchi_key + "</span>"), $(".corpus-count h2").html(global.formatNumber(i.global_frequency)), results.view.generic.loader.hide(), t.bind.sidebar(t)
                            },
                            dropDown: function(e, t) {
                                "use strict";
                                var n = [];
                                return n.push('<div class="info-dropdown" id="info-' + e.toLowerCase() + '">'), n.push('<a href="#" class="drop-down">' + e + " <span></span></a>"), n.push('<p class="content">' + t + "</p>"), n.push("</div>"), n.join("")
                            },
                            cell: function(e, t) {
                                "use strict";
                                var n = [];
                                return n.push('<div class="info-cell" id="cell-' + e.toLowerCase().replace(/ /g, "-") + '">'), n.push('<p class="label">' + e + "</p>"), n.push('<p class="value">' + t + "</p>"), n.push("</div>"), n.join("")
                            }
                        }
                    },
                    partners: {
                        placeholder: function() {
                            "use strict";
                            var e = '<div id="partners"></div>';
                            return e
                        },
                        populate: {
                            init: function(e, t) {
                                "use strict";
                                var n = this,
                                    r = [],
                                    i = [],
                                    s = [],
                                    o = typeof e.chemspider.urls != "undefined" ? !0 : !1,
                                    u = typeof e.rsc.urls != "undefined" ? !0 : !1,
                                    a = typeof e.chembl.urls != "undefined" ? !0 : !1,
                                    f = typeof e.pubchem.urls != "undefined" ? !0 : !1;
                                r.push(n.chemspider(e, o)), r.push(n.rsc(e, u)), r.push(n.pubchem(e, f)), r.push(n.chembl(e, a)), $("#partners").html(r.join(""))
                            },
                            chemspider: function(e, t) {
                                "use strict";
                                var n = [],
                                    r = t === !0 ? "ChemSpider database results" : "There were no ChemSpider results found",
                                    i = t === !0 ? e.chemspider.urls.split(",").length : 0,
                                    s = t === !0 ? e.chemspider.urls : "http://www.chemspider.com/";
                                return n.push('<div class="partner clear" id="chemspider">'), n.push('<div class="left">'), n.push(r), n.push('<a href="' + s + '">View ChemSpider hits</a>'), n.push("</div>"), n.push('<div class="right">'), n.push('<a href="' + s + '">'), n.push(i), n.push("</a>"), n.push("</div>"), n.push("</div>"), n.join("")
                            },
                            pubchem: function(e, t) {
                                "use strict";
                                var n = [],
                                    r = t === !0 ? "PubChem database results" : "There were no PubChem results found",
                                    i = t === !0 ? 1 : 0,
                                    s = t === !0 ? e.pubchem.urls : "http://pubchem.ncbi.nlm.nih.gov/";
                                return n.push('<div class="partner clear" id="pubchem">'), n.push('<div class="left">'), n.push(r), t === !0 && n.push('<a href="' + s + '">View PubChem hits</a>'), n.push("</div>"), n.push('<div class="right">'), n.push('<a href="' + s + '">'), n.push(i), n.push("</a>"), n.push("</div>"), n.push("</div>"), n.join("")
                            },
                            chembl: function(e, t) {
                                "use strict";
                                var n = [],
                                    r = t === !0 ? "ChEMBL database results" : "There were no ChEMBL results found",
                                    i = t === !0 ? 1 : 0,
                                    s = t === !0 ? e.chembl.urls : "https://www.ebi.ac.uk/chembl/";
                                return n.push('<div class="partner clear" id="chembl">'), n.push('<div class="left">'), n.push(r), t === !0 && n.push('<a href="' + s + '">View ChEMBL hits</a>'), n.push("</div>"), n.push('<div class="right">'), n.push('<a href="' + s + '">'), n.push(i), n.push("</a>"), n.push("</div>"), n.push("</div>"), n.join("")
                            },
                            rsc: function(e, t) {
                                "use strict";
                                var n = [],
                                    r = [],
                                    i = [],
                                    s = t === !0 ? "RSC journal results" : "No RSC results found",
                                    o = t === !0 ? e.chemspider.urls.split(",").length : 0,
                                    u = typeof e.rsc.total == "string" && e.rsc.total.length >= 5 ? "small" : "large";
                                return n.push('<div class="partner clear" id="rsc">'), n.push('<div class="left">'), n.push(s), t === !0 ? typeof e.rsc.total == "string" ? (n.push('<a href="' + e.rsc.urls + '">View RSC hits</a>'), n.push("</div>"), n.push('<div class="right">'), n.push('<div class="result-count ' + u + '"><a href="' + e.rsc.urls + '">' + e.rsc.total + "</a></div>"), n.push("</div>")) : typeof e.rsc.total != "undefined" && ($.each(e.rsc.total, function(t) {
                                    r.push('<a href="' + e.rsc.urls[t] + '">View result set</a>'), i.push('<div class="result-count"><a href="' + e.rsc.urls[t] + '">' + this + "</a></div>")
                                }), n.push(r.join("")), n.push("</div>"), n.push('<div class="right">'), n.push(i.join("")), n.push("</div>")) : (n.push('<a href="http://pubs.rsc.org/en/Search/">View RSC hits</a>'), n.push("</div>"), n.push('<div class="right">'), n.push('<div class="result-count">0</div>'), n.push("</div>")), n.push("</div>"), n.join("")
                            }
                        }
                    }
                }
            },
            column: {
                init: function(e) {
                    "use strict";
                    var t = this,
                        n = [];
                    return n.push('<div id="chemical-column">'), n.push(t.partial.distribution.placeholder(e)), n.push(t.partial.tabs.init(e)), n.push("</div>"), n.join("")
                },
                partial: {
                    distribution: {
                        placeholder: function(e) {
                            "use strict";
                            var t = [];
                            return t.push('<div class="clear" id="corpus-map-container">'), t.push(e.view.loader("column", "The corpus map is loading", "small")), t.push("</div>"), t.join("")
                        },
                        populate: {
                            init: function(e, t) {
                                "use strict";
                                var n = this,
                                    r, i, s = [],
                                    o = [],
                                    u = [],
                                    a = [],
                                    f = 0,
                                    l = ["total", "title", "abstract", "claims", "description", "images", "CWU's"];
                                s.push('<div id="corpus-map" class="clear">'), s.push('<div id="corpus-header" class="clear">'), $.each(e.data.sections, function(e) {
                                    u.push(parseInt(this)), a.push(e.charAt(0).toUpperCase() + e.slice(1).replace("_", " ")), o.push(n.partial.header(e, this, t))
                                });
                                for (r = 0; r < u.length; r++) f += u[r];
                                o.unshift(n.partial.header("found", f, t)), s.push(o.join("")), s.push("</div>"), s.push('<div id="chart-container"></div>'), s.push('<div class="temp-overlay">Still to come: Analysis of structure occurrence <span>A breakdown of document locations and data sources for structures across all SureChem patents</span></div>'), s.push("</div>"), $("#corpus-map-container").html(s.join("")), $.browser.msie || t.view.chart.distribution(a, u)
                            },
                            partial: {
                                header: function(e, t, n) {
                                    "use strict";
                                    var r = [],
                                        i = e === "mol_attachment" ? "mol-attach" : e,
                                        s = e === "mol_attachment" ? 'CWU\'s (<a href="https://surechem.uservoice.com/knowledgebase/articles/123211-uspto-complex-work-units">?</a>)' : e;
                                    return r.push('<div class="corp-block" id="section-' + i + '">'), r.push('<span class="top">' + s.charAt(0).toUpperCase() + s.slice(1) + "</span>"), r.push('<span class="value">' + t + "</span>"), r.push('<span class="bottom">times</span>'), r.push("</div>"), r.join("")
                                }
                            }
                        }
                    },
                    tabs: {
                        init: function(e) {
                            "use strict";
                            var t = this,
                                n = [],
                                r = [],
                                i = [],
                                s = ["Related structures", "Patent hits"];
                            return $.each(s, function(e) {
                                i.push(t.partial.controls.tab(this, e))
                            }), n.push(t.partial.controls.container(i.join(""))), n.push(t.partial.related.placeholder(e)), n.push(t.partial.d4s.placeholder(e)), r.push(t.partial.container(n.join(""))), r.join("")
                        },
                        partial: {
                            container: function(e) {
                                "use strict";
                                var t = [];
                                return t.push('<div id="tabbed-view-container" class="clear">'), t.push(e), t.push("</div>"), t.join("")
                            },
                            controls: {
                                tab: function(e, t) {
                                    "use strict";
                                    var n = [],
                                        r = t === 0 ? "active" : "";
                                    return n.push('<li class="tab tab-' + t + " " + r + '" id="' + e.toLowerCase().replace(/ /g, "-") + '">'), n.push('<a href="#">' + e + "</a>"), n.push("</li>"), n.join("")
                                },
                                container: function(e) {
                                    "use strict";
                                    var t = [];
                                    return t.push('<ul id="chempage-tabs" class="tab-container clear">'), t.push(e), t.push("</ul>"), t.join("")
                                }
                            },
                            related: {
                                placeholder: function(e) {
                                    "use strict";
                                    var t = '<div id="related-structures-container" class="tab-content clear active">' + e.view.loader("column", "The related structures are loading", "small") + "</div>";
                                    return t
                                },
                                populate: function(e, t) {
                                    "use strict";
                                    var n = this,
                                        r = [];
                                    r.push('<div class="notice grey">Related structures are those within our corpus with a similarity equal to or greater than 0.95</div>'), r.push(results.view.results.structure.render(e, results, !1)), r.push('<div class="view-all-results"><a href="/en/search/results/' + t.data.partialHash + '/">View all results</a>'), $("#related-structures-container").html(r.join("")), n.checkResults(), results.bind.results.structure(results), n.singleClick()
                                },
                                checkResults: function() {
                                    "use strict";
                                    var e = $("#related-structures-container");
                                    e.find(".no-hits").length !== 0 && e.find(".notice").hide().end().find(".view-all-results").hide()
                                },
                                singleClick: function() {
                                    "use strict";
                                    var e = $("li.result"),
                                        t;
                                    $.each(e, function() {
                                        t = $(this).find(".smiles-value").text(), $(this).find(".single-result").unbind().attr({
                                            href: "/" + I18n.locale + "/chemical?struct=" + encodeURIComponent(t)
                                        })
                                    })
                                }
                            },
                            d4s: {
                                placeholder: function(e) {
                                    "use strict";
                                    var t = '<div id="patent-hits-container" class="tab-content clear">' + e.view.loader("column", "Documents for the selected structure are loading", "small") + "</div>";
                                    return t
                                },
                                populate: function(e, t) {
                                    "use strict";
                                    var n = results.view.results.doc.render("d4s-chem", e, t.data.d4s_hash, results);
                                    n += '<div class="view-all-results"><a href="/' + I18n.locale + "/search/results/" + t.data.d4s_hash + '/">View all results</a></div>', $("#patent-hits-container").html(n), results.view.results.doc.partial.tdLangs.show(), results.bind.results.d4s(results), results.bind.results.doc(results)
                                }
                            }
                        }
                    }
                }
            }
        },
        bind: {
            init: function(e) {
                "use strict";
                $(".enlarge-image").click(function(t) {
                    t.preventDefault();
                    var n = $(".struct-name h1").text();
                    e.view.modal.init(e.data.structure, !0, e)
                }), $(".tab a").click(function(t) {
                    t.preventDefault();
                    var n = $(this).parent(),
                        r = n.attr("id");
                    n.hasClass("active") || ($(".tab-content").hide(), $("#" + r + "-container").show(), $("li.tab").removeClass("active"), n.addClass("active"), r === "patent-hits" && $("#patent-hits-container .loader").length === 1 && e.model.d4s.set(e))
                })
            },
            sidebar: function(e) {
                "use strict";
                $(".info-dropdown a").click(function(e) {
                    e.preventDefault();
                    var t = $(this);
                    t.siblings(".content").slideToggle(150, function() {
                        t.toggleClass("active")
                    })
                })
            },
            modal: function(e) {
                "use strict";
                $("#close-modal").click(function() {
                    $.modal.close()
                })
            }
        }
    },
    doc = {
        navigation: {},
        init: function() {
            "use strict";
            var e = this;
            document.title = docData.docHash + " - " + document.title, e.view.loader.show(), e.model.get(e, function(t) {
                e.view.doc.init(t, e)
            })
        },
        model: {
            get: function(e, t) {
                "use strict";
                var n = typeof docData.docQuery != "undefined" && docData.docQuery.length >= 1 ? "&highlight_query=" + docData.docQuery : "&highlight_query=",
                    r = typeof docData.searchHash != "undefined" ? "&search_hash=" + docData.searchHash : "",
                    i = globalData.apiUrl + "/document/patents/" + docData.docHash + "/contents?annotated=yes" + n + r + "&fields=" + global.dev(!0, "&") + "&auth_token=" + globalData.user.token;
                $.ajax({
                    type: "GET",
                    url: i,
                    dataType: "json",
                    success: function(e) {
                        t(e)
                    },
                    error: function(t) {
                        e.view.loadError(t)
                    }
                })
            },
            chemInfo: function(e, t) {
                "use strict";
                var n = globalData.apiUrl + "/chemical/id/",
                    r = {
                        dev: global.dev(!1),
                        auth_token: globalData.user.token,
                        ids: e
                    };
                $.ajax({
                    type: "POST",
                    url: n,
                    data: r,
                    dataType: "json",
                    success: function(e) {
                        t(!0, e)
                    },
                    statusCode: {
                        401: function() {
                            global.badAuth()
                        },
                        400: function() {
                            t(!1, "")
                        }
                    }
                })
            },
            imageChemInfo: function(e, t) {
                "use strict";
                var n = globalData.apiUrl + "/document/patents/" + docData.docHash + "/attachment/" + e + "/chemicals";
                $.ajax({
                    type: "GET",
                    url: n,
                    dataType: "json",
                    success: function(e) {
                        t(!0, e)
                    },
                    statusCode: {
                        401: function() {
                            global.badAuth()
                        },
                        400: function() {
                            t(!1, "")
                        }
                    }
                })
            },
            getFamily: function(e, t) {
                "use strict";
                var n = typeof docData != "undefined" ? docData.docHash : e,
                    r = globalData.apiUrl + "/document/patents/" + n + "/family/members?" + global.dev(!0, "") + "&auth_token=" + globalData.user.token;
                $.ajax({
                    type: "GET",
                    url: r,
                    dataType: "json",
                    success: function(e) {
                        t(e)
                    },
                    statusCode: {
                        401: function() {
                            global.badAuth()
                        },
                        400: function() {
                            t(!1, "")
                        }
                    }
                })
            }
        },
        view: {
            loader: {
                show: function() {
                    "use strict";
                    var e = [],
                        t = $(window).outerWidth() / 2 - 117,
                        n = $(window).outerHeight() / 2 - 175;
                    $("#doc-loader").css({
                        top: n + "px",
                        left: t + "px"
                    }).fadeIn(100)
                },
                hide: function() {
                    "use strict";
                    $("#doc-loader").fadeOut(250)
                }
            },
            loadError: function(e) {
                "use strict";
                var t = this;
                e.status === 401 ? window.location = "/signout" : (t.loader.hide(), $(".main-column").css({
                    marginLeft: "0px"
                }), global.loadError(e.status.toString(), "document"))
            },
            sidebar: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = [];
                    return r.push(n.backToSearch()), r.push(n.docNav()), r.push(n.buildNav.init(e, t)), r.push(n.hideAdditional()), r.push(n.buildExport()), r.push(n.buildPdf.init(e)), n.wrap(r.join(""))
                },
                wrap: function(e) {
                    "use strict";
                    return '<div id="sidebar" class="clear default">' + e + "</div>"
                },
                backToSearch: function() {
                    "use strict";
                    var e = [],
                        t = typeof docData.searchHash != "undefined" ? "&docs_for_structs=" + docData.searchHash : "";
                    return typeof docData.root != "undefined" && typeof docData.root.hash != "undefined" && e.push('<div id="back-button" class="clear"><a href="/' + I18n.locale + "/search/results/" + docData.root.hash + "/?page=" + docData.root.page + t + '" class="button single green">Back to search results</a></div>'), e.join("")
                },
                docNav: function() {
                    "use strict";
                    var e = [];
                    return e.push('<div class="document-nav-container clear">'), e.push('<a href="#" class="button left normal" id="biblio">Front-page</a>'), e.push('<a href="#" class="button normal" id="claims">Claims</a>'), e.push('<a href="#" class="button right normal" id="description">Description</a>'), e.push("</div>"), e.join("")
                },
                query: {
                    init: function(e) {
                        "use strict";
                        var t = this,
                            n = e,
                            r = $.parseJSON(n.search_appendix),
                            i = n.query,
                            s = [];
                        s.push('<div id="search-query-container">'), typeof docData != "undefined" && s.push('<a href="#" id="query-dropdown-toggle">Your query</a>'), s.push('<div id="query-dropdown">'), s.push(t.structQuery(r)), s.push(t.queryRender(i, r)), s.push("</div>"), s.push("</div>");
                        if (typeof docData == "undefined") return s.join("");
                        $(s.join("")).insertAfter(".document-nav-container")
                    },
                    structQuery: function(e) {
                        "use strict";
                        return typeof e[0]["struct-input"] != "undefined" ? '<img src="https://direct.surechem.com/service/chemical/image?structure=' + encodeURIComponent(e[0]["struct-input"]) + '&structure_hightlight&height=181&width=181" alt="' + e[0]["struct-input"] + '" />' : ""
                    },
                    queryRender: function(e, t) {
                        "use strict";
                        var n = this,
                            r = [],
                            i = [],
                            s;
                        return e && r.push('<input type="hidden" id="current-search-query" value="' + e.replace(/"/g, "&quot;") + '" />'), $.each(t[0], function(e) {
                            s = e, typeof this != "object" ? r.push(n.queryRenderRow(t[1][e], this)) : (typeof t[1][e].values != "undefined" ? r.push(n.queryRenderRow(t[1][e].key, t[1][e].values.join(", "))) : r.push(n.queryRenderRow(t[1][s], t[0][s])), i = [])
                        }), r.join("")
                    },
                    queryRenderRow: function(e, t, n) {
                        "use strict";
                        var r = [];
                        r.push('<div class="query-row-container">');
                        switch (typeof e) {
                            case "object":
                                $.each(e, function(n, i) {
                                    typeof e[n] == "string" && (r.push('<span class="field">' + e[n] + "</span>"), r.push('<span id="current-query-' + e[n].toLowerCase().replace(" ", "-") + '" class="value">' + t[n] + "</span>"))
                                });
                                break;
                            case "string":
                                r.push('<span class="field">' + e + "</span>"), r.push('<span id="current-query-' + e.toLowerCase().replace(" ", "-") + '" class="value">' + t + "</span>")
                        }
                        return r.push("</div>"), r.join("")
                    },
                    show: function() {
                        "use strict";
                        var e = $("#sidebar"),
                            t = $("#query-dropdown"),
                            n = '<p id="scroll-note">Scroll within the query to view it all</p>',
                            r, i;
                        t.toggle(0, function() {
                            i = e.outerHeight(), r = $(window).outerHeight(), i > r ? (t.addClass("long"), $(n).insertAfter(t)) : (t.removeClass("long"), $("#scroll-note").remove())
                        })
                    }
                },
                buildNav: {
                    init: function(e, t) {
                        "use strict";
                        var n = this,
                            r = [];
                        return t.navigation.total = [], r.push('<div class="result-nav-container">'), r.push(n.navRender("chemical-highlight", t)), r.push(n.navRender("text-highlight", t)), r.push("</div>"), r.join("")
                    },
                    navRender: function(e, t) {
                        "use strict";
                        var n = $("." + e).length,
                            r = [],
                            i = e === "chemical-highlight" ? "All structure search results" : "All text search results";
                        return n !== 0 && (r.push('<div id="group-' + e + '" class="result-nav control-' + e + '" style="background-color: #666">'), r.push('<div class="header clear"><div class="query"><a href="#" class="tooltip-small navigate-title" title="Toggle result visibility">' + i + "</a></div></div>"), r.push('<div class="button-container">'), r.push('<ul class="nav-buttons clear"><li class="first-result" id="first-' + e + '"><a href="#" class="doc-nav" title="First result">First</a></li><li class="previous-result" id="prev-' + e + '"><a href="#" class="doc-nav" title="Previous result">Previous</a></li><li class="goto-result"><a href="#" class="doc-nav" title="Go to result"><span class="count">0</span>/<span class="total">' + n + '</span></a></li><li class="next-result" id="next-' + e + '"><a href="#" class="doc-nav" title="Next result">Next</a></li><li class="last-result" id="last-' + e + '"><a href="#" class="doc-nav" title="Last result">Last</a></li></ul>'), r.push('<div class="goto-data-entry" id="goto-' + e + '"><input type="text" name="goto-input" class="goto-input" placeholder="Enter result and hit return" /></div>'), r.push("</div>"), r.push("</div>"), t.navigation.total.push(n)), r.join("")
                    }
                },
                hideAdditional: function() {
                    "use strict";
                    var e = '<div id="all-container" class="clear"><input id="show-annot" type="checkbox" name="show-annot"><label for="show-all">Highlight additional recognised chemical terms</label></div>';
                    return e
                },
                buildExport: function() {
                    "use strict";
                    var e = [];
                    return e.push('<div id="exp-container" class="clear">'), globalData.user.enabledFeatures.document_structure_export === !0 && e.push('<a href="#" id="export-all-chem" class="button normal single"><span></span>Export document chemistry</a>'), globalData.user.enabledFeatures.export_family_chemistry === !0 && e.push('<a href="#" id="export-family-chem" class="button normal single"><span></span>Export family chemistry</a>'), e.push("</div>"), e.join("")
                },
                buildPdf: {
                    init: function(e) {
                        "use strict";
                        var t = this,
                            n = '<div id="pdf-container" class="clear"></div>';
                        return globalData.user.enabledFeatures.pdf_download === !0 && (n = '<div id="pdf-container" class="clear"><a href="' + e.data.contents["patent-document"]["pdf-url"] + '" id="download-pdf" class="button normal single" target="_blank"><span></span>Download patent PDF</a></div>'), n
                    }
                }
            },
            doc: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = [],
                        i = e.data.contents["patent-document"]["family-id"].length > 0 ? e.data.contents["patent-document"]["family-id"][0].$ : "";
                    r.push(n.biblio.init(e, n, t)), r.push(n.textSection.init("claims", e, n, t)), r.push(n.textSection.init("description", e, n, t)), $(".main-column").append(r.join("")), $("#page-document").addClass("sidebar-bg").prepend(t.view.sidebar.init(e, t)), typeof docData.root != "undefined" && typeof docData.root.hash != "undefined" && results.model.get(docData.root.hash, "1", results, "1", function(e) {
                        t.view.sidebar.query.init(e.data.query), t.view.bind.query(t)
                    }), n.langCheck(), t.view.loader.hide(), t.view.bind.doc(t), t.view.bind.sideBar(t), globalData.user.enabledFeatures.patent_family === !0 && i.length > 0 && t.model.getFamily(null, function(e) {
                        n.family.init(e, i)
                    })
                },
                langCheck: function() {
                    "use strict";
                    $("#title-lang .lang-en").length === 0 && $("#title-lang .lang-EN").length === 0 && $("#title-lang li:first-child a, h1 .lang-container:first-child").addClass("selected-lang"), $("#abstract-lang .lang-en").length === 0 && $("#abstract-lang .lang-EN").length === 0 && $("#abstract-lang li:first-child a, #abstract .lang-container:first-child").addClass("selected-lang"), $("#claims-lang .lang-en").length === 0 && $("#claims-lang .lang-EN").length === 0 && $("#claims-lang li:first-child a, #claims-container .lang-container:first").addClass("selected-lang"), $("#description-lang .lang-en").length === 0 && $("#description-lang .lang-EN").length === 0 && $("#description-lang li:first-child a, #description-container .lang-container:first").addClass("selected-lang")
                },
                wrap: function(e, t, n) {
                    "use strict";
                    var r = [];
                    return r.push('<div class="result-container" id="' + n + '-container">'), t !== !1 && r.push('<ul id="' + n + '-lang" class="lang-selector">' + t + "</ul>"), r.push('<div class="ribbon"></div>'), r.push(e), r.push("</div>"), r.join("")
                },
                biblio: {
                    init: function(e, t, n) {
                        "use strict";
                        var r = this,
                            i = [],
                            s;
                        return i.push('<div id="doc-header">'), i.push(r.render.ttl(r.simpleNormalise(e.data.contents["patent-document"]["bibliographic-data"]["technical-data"]["invention-title"]), e)), i.push("</div>"), i.push(r.render.abst(r.simpleNormalise(e.data.contents["patent-document"]["abstract"]))), i.push(RenderBiblio.init(e)), t.wrap(i.join(""), !1, "biblio")
                    },
                    simpleNormalise: function(e) {
                        "use strict";
                        var t = [];
                        return typeof e != "undefined" && $.each(e, function() {
                            t.push({
                                is_eng: this["@lang"] === "EN" ? !0 : !1,
                                lang: this["@lang"],
                                content: this.$
                            })
                        }), t
                    },
                    render: {
                        ttl: function(e, t) {
                            "use strict";
                            var n = [],
                                r = [],
                                i = typeof t.data.contents["patent-document"]["bibliographic-data"]["publication-reference"][0] != "undefined" ? global.formatDate(t.data.contents["patent-document"]["bibliographic-data"]["publication-reference"][0]["document-id"].date.$) : "",
                                s, o;
                            n.push('<div id="sub-title"><span id="patent-id">' + docData.docHash + ' <span class="date-head">/ ' + i + "</span></span></div>"), n.push("<h1>");
                            for (o = 0; o < e.length; o++) s = e[o].is_eng === !0 ? "selected-lang " : "", n.push('<span class="' + s + "lang-container lang-" + e[o].lang.toLowerCase() + '" id="title-lang-' + e[o].lang.toLowerCase() + '">' + e[o].content + "</span>"), r.push('<li><a href="#" id="title-lang-' + e[o].lang.toLowerCase() + '" class="' + s + "lang-" + e[o].lang.toLowerCase() + '">' + e[o].lang + "</a></li>");
                            return n.push("</h1>"), typeof e != "undefined" && e.length > 0 && n.push('<ul id="title-lang" class="lang-selector">' + r.join("") + "</ul>"), n.join("")
                        },
                        abst: function(e) {
                            "use strict";
                            var t = [],
                                n = [],
                                r, i;
                            if (typeof e != "undefined" && e.length > 0) {
                                t.push('<div id="abstract">'), t.push("<h2>Abstract</h2>"), t.push('<div id="text">');
                                for (i = 0; i < e.length; i++) r = e[i].is_eng === !0 ? "selected-lang " : "", t.push('<div class="' + r + "lang-container lang-" + e[i].lang.toLowerCase() + '" id="abstract-lang-' + e[i].lang.toLowerCase() + '">' + e[i].content + "</div>"), n.push('<li><a href="#" id="abstract-lang-' + e[i].lang.toLowerCase() + '" class="' + r + "lang-" + e[i].lang.toLowerCase() + '">' + e[i].lang + "</a></li>");
                                t.push("</div>"), t.push('<ul id="abstract-lang" class="lang-selector">' + n.join("") + "</ul>"), t.push('<div id="image"></div>'), t.push("</div>")
                            }
                            return t.join("")
                        }
                    }
                },
                textSection: {
                    init: function(e, t, n, r) {
                        "use strict";
                        var i = this,
                            s = t.data.contents["patent-document"][e],
                            o = [],
                            u = [],
                            a, f = !1;
                        return typeof s != "undefined" && s.length !== 0 && (f = !0, $.each(s, function() {
                            a = this["@lang"] === "EN" ? "selected-lang " : "", o.push('<div class="' + a + "lang-container lang-" + this["@lang"] + '" id="' + e + "-lang-" + this["@lang"] + '">' + this.$ + "</div>"), u.push('<li><a href="#" id="' + e + "-lang-" + this["@lang"] + '" class="' + a + "lang-" + this["@lang"] + '">' + this["@lang"] + "</a></li>")
                        })), f === !0 ? n.wrap(o.join(""), u.join(""), e) : ""
                    }
                },
                family: {
                    init: function(e, t) {
                        "use strict";
                        var n = this,
                            r = e.data[docData.docHash].members,
                            i = [];
                        $.each(r, function(e, t) {
                            i.push(n.renderFamilyMember(e))
                        }), $(n.wrap(i.join(""))).insertAfter("#application-table")
                    },
                    renderFamilyMember: function(e) {
                        "use strict";
                        var t = "/" + I18n.locale + "/document/" + e + "/";
                        return typeof docData.searchHash != "undefined" && (t += "search/" + docData.searchHash + "/"), typeof docData.docQuery != "undefined" && docData.docQuery.length >= 1 && (t += "?query=" + encodeURIComponent(docData.docQuery)), typeof docData.root != "undefined" && typeof docData.root.hash != "undefined" && (t.indexOf("?") === -1 ? t += "?" : t += "&", t += "root_search=" + docData.root.hash + "&root_page=" + docData.root.page + "&docs_for_structs_page=1"), '<a href="' + t + '" target="_blank">' + e + "</a>"
                    },
                    wrap: function(e) {
                        "use strict";
                        var t = e.length !== 0 ? e : '<div class="no-content">No Family Data.</div>';
                        return '<table id="application-table" class="front-page-table" cellspacing="0" cellpadding="0" width="100%"><tr><td id="patent-family" colspan="3"><h2>Patent Family Members</h2><div class="clear">' + t + "</div></td></tr></table>"
                    }
                }
            },
            navigation: {
                defineIndex: function(e, t) {
                    "use strict";
                    var n;
                    return e === "chemical-highlight" || e === "text-highlight" && t.navigation.total.length === 1 ? n = t.navigation.total[0] : n = t.navigation.total[1], n
                },
                positive: function(e, t, n) {
                    "use strict";
                    var r = this,
                        i = parseInt(t.text(), 10),
                        s = r.defineIndex(e, n),
                        o = "." + e + "-" + (i + 1);
                    i !== s ? ($.scrollTo(o, 500, {
                        offset: -100
                    }), $("span." + e).removeClass("highlighted-by-nav"), $(o).addClass("highlighted-by-nav"), t.text(i + 1)) : $.modal('<div class="first-modal">' + I18n.t("doc.nav.last_html") + "</div>", {
                        opacity: 30,
                        overlayCss: {
                            backgroundColor: "#000"
                        }
                    })
                },
                negative: function(e, t, n) {
                    "use strict";
                    var r = this,
                        i = parseInt(t.text(), 10),
                        s = r.defineIndex(e, n),
                        o = "." + e + "-" + (i - 1);
                    i >= 2 ? ($.scrollTo(o, 500, {
                        offset: -100
                    }), $("span." + e).removeClass("highlighted-by-nav"), $(o).addClass("highlighted-by-nav"), t.text(i - 1)) : ($.scrollTo($("body"), 500), $("span." + e).removeClass("highlighted-by-nav"), t.text(0))
                },
                terminus: function(e, t, n, r) {
                    "use strict";
                    var i = this,
                        s = parseInt(n.text(), 10),
                        o = i.defineIndex(t, r),
                        u = e === "first" ? "." + t + "-" + 1 : "." + t + "-" + o;
                    $.scrollTo(u, 500, {
                        offset: -100
                    }), $("span." + t).removeClass("highlighted-by-nav"), $(u).addClass("highlighted-by-nav"), n.text(o)
                },
                goTo: function(e, t, n, r) {
                    "use strict";
                    var i = this,
                        s = i.defineIndex(t, r),
                        o = "." + t + "-" + e;
                    e <= s ? ($.scrollTo(o, 500, {
                        offset: -100
                    }), $("span." + t).removeClass("highlighted-by-nav"), $(o).addClass("highlighted-by-nav"), n.text(s)) : alert("There aren't that many results!")
                }
            },
            chemInfo: {
                init: function(e, t, n) {
                    "use strict";
                    var r = this;
                    $.modal(r.renderModal(e, t), {
                        overlayClose: !0,
                        opacity: 50,
                        overlayCss: {
                            backgroundColor: "#000"
                        },
                        onShow: function() {
                            n.view.bind.closeModal()
                        }
                    })
                },
                renderModal: function(e, t) {
                    "use strict";
                    var n = this,
                        r = [],
                        i = 200 * t.data.length + (25 + t.data.length * 25);
                    return r.push('<div class="clear" id="chemical-container-modal" style="width: ' + i + 'px;">'), r.push('<div id="tital-controls" class="clear">'), r.push("<h2>Chemical information</h2>"), r.push('<a href="#" class="close-modal" title="Close modal">' + I18n.t("doc.tooltip.close") + "</a>"), r.push("</div>"), r.push('<div class="modal-result-container clear">'), r.push('<p class="note">Structures generated for this name:</p>'), $.each(global.sortObjectKeys(t.data), function(e) {
                        r.push(n.modalResult(this, e))
                    }), r.push("</div>"), r.join("")
                },
                modalResult: function(e, t) {
                    "use strict";
                    var n = this,
                        r = [];
                    return r.push('<div class="ind-container clear">'), r.push('<div class="left-cont" id="left-' + t + '">'), r.push('<img src="https://direct.surechem.com/service/chemical/image?structure=' + encodeURIComponent(e.smiles) + '&structure_hightlight&height=200&width=200" alt="' + e.smiles + '" />'), r.push('<div class="external"><span class="temp">' + I18n.t("doc.tooltip.loading_external") + "</span></div>"), r.push('<div class="data">' + e.mol_weight.toString().slice(0, 7) + "</div>"), r.push("</div>"), r.push('<div class="right-cont">'), r.push('<p><span class="key">' + I18n.t("doc.modal.chem_name") + '</span><span class="value name-value">' + e.name + "</span></p>"), r.push('<div class="more-info">'), r.push('<p><span class="key">' + I18n.t("doc.modal.smiles") + '</span><span class="value smiles-value">' + e.smiles + "</span></p>"), r.push('<p><span class="key">' + I18n.t("doc.modal.inchi") + '</span><span class="value">' + e.inchi + "</span></p>"), r.push('<p><span class="key">' + I18n.t("doc.modal.inchi_key") + '</span><span class="value">' + e.inchi_key + "</span></p>"), r.push("</div>"), r.push('<div id="button-container" class="clear">'), r.push('<p class="title">Tools:</p>'), r.push('<a href="/' + I18n.locale + "/chemical?struct=" + encodeURIComponent(e.smiles) + '" class="modal-button view" title="View this structure in more detail" target="_blank">View</a>'), r.push("</div>"), r.push("</div>"), r.push("</div>"), n.getExternal(e, t), r.join("")
                },
                getExternal: function(e, t) {
                    "use strict";
                    var n = [];
                    global.external(e.inchi_key, function(e) {
                        typeof e.chemspider.urls != "undefined" && e.chemspider.urls.length >= 1 && n.push('<a href="' + e.chemspider.urls + '" target="_blank" class="button single green tooltip-small" title="View this structure in ChemSpider">1</a>'), typeof e.pubchem.urls != "undefined" && e.pubchem.urls.length >= 1 && n.push('<a href="' + e.pubchem.urls + '" target="_blank" class="button single green tooltip-small" title="View this structure in PubChem">1</a>'), typeof e.chembl.urls != "undefined" && e.chembl.urls.length >= 1 && n.push('<a href="' + e.chembl.urls + '" target="_blank" class="button single green tooltip-small" title="View this structure in ChEMBL">1</a>'), typeof e.rsc.total == "string" && e.rsc.total !== "0" ? n.push('<a href="' + e.rsc.urls + '" target="_blank" class="button single green tooltip-small" title="View results at the RSC">' + e.rsc.total + "</a>") : typeof e.rsc.total == "object" && $.each(e.rsc.total, function(t, r) {
                            n.push('<a href="' + e.rsc.urls[t] + '" target="_blank" class="button single green tooltip-small" title="We found multiple results at the RSC">' + this + "</a>")
                        }), $("#left-" + t + " .external").html(n.join("")), global.tooltip()
                    })
                }
            },
            bind: {
                doc: function(e) {
                    "use strict";
                    $(".chemical").click(function(t) {
                        t.preventDefault();
                        var n = $(this).attr("title").split(": ")[1];
                        e.model.chemInfo(n, function(t, n) {
                            e.view.chemInfo.init(t, n, e)
                        })
                    }), $(".image-annotation").click(function(t) {
                        t.preventDefault();
                        var n = $(this).attr("file");
                        e.model.imageChemInfo(n, function(t, n) {
                            e.view.chemInfo.init(t, n, e)
                        })
                    }), $(".lang-selector").hover(function() {
                        $(this).find("a").show()
                    }, function() {
                        $(this).find("a").hide()
                    }), $(".lang-selector a").click(function(e) {
                        e.preventDefault();
                        var t = $(this).attr("id"),
                            n = $(this).parent().parent().parent().attr("id");
                        $("#" + n + " .lang-container").removeClass("selected-lang").hide(), $(".lang-container#" + t).show().addClass("selected-lang"), $("#" + n + " .lang-selector a").removeClass("selected-lang"), $(this).addClass("selected-lang")
                    }), $(".drop-down-front").click(function(e) {
                        e.preventDefault(), $(this).toggleClass("open"), $(this).parent().siblings(".drop-cont").slideToggle(150)
                    }), $(".address-drop-down-toggle").click(function(e) {
                        e.preventDefault(), $(this).siblings(".address-drop-down").slideToggle()
                    })
                },
                closeModal: function() {
                    "use strict";
                    $(".close-modal").click(function(e) {
                        e.preventDefault(), $.modal.close()
                    })
                },
                sideBar: function(e) {
                    "use strict";
                    $(window).bind("scroll", function() {
                        $(this).scrollTop() > 40 && $("#sidebar").hasClass("default") && ($("#sidebar").css({
                            top: "0px",
                            position: "fixed"
                        }).removeClass("default").addClass("shown"), $("#notification-container") && $("#notification-container").css({
                            top: "25px",
                            opacity: .5
                        })), $(this).scrollTop() < 40 && $("#sidebar").hasClass("shown") && ($("#sidebar").css({
                            top: "0px",
                            position: "relative"
                        }).removeClass("shown").addClass("default"), $("#notification-container") && $("#notification-container").css({
                            top: "55px",
                            opacity: 1
                        }))
                    }), $(".document-nav-container a").click(function(e) {
                        e.preventDefault();
                        var t = "#" + $(this).attr("id") + "-container";
                        $.scrollTo(t, 500, {
                            offset: -50
                        })
                    }), $(".next-result a, .previous-result a").click(function(t) {
                        t.preventDefault();
                        var n = $(this).parent().attr("class").indexOf("next") !== -1 ? "next" : "prev",
                            r = $(this).parent().attr("id").split(n + "-")[1],
                            i = $(this).parent().parent().find(".count");
                        n === "next" ? e.view.navigation.positive(r, i, e) : e.view.navigation.negative(r, i, e)
                    }), $(".last-result a, .first-result a").click(function(t) {
                        t.preventDefault();
                        var n = $(this).parent().attr("class").indexOf("last") !== -1 ? "last" : "first",
                            r = $(this).parent().attr("id").split(n + "-")[1],
                            i = $(this).parent().parent().find(".count");
                        e.view.navigation.terminus(n, r, i, e)
                    }), $(".goto-result a").click(function(e) {
                        e.preventDefault(), $(this).parent().parent().parent().find(".goto-data-entry").slideToggle(150)
                    }), $(".goto-input").change(function() {
                        var t = parseInt($(this).val(), 10),
                            n = $(this).parent().attr("id").split("goto-")[1],
                            r = $(this).parent().parent().find(".count");
                        e.view.navigation.goTo(t, n, r, e)
                    }), $(".navigate-title").click(function(e) {
                        e.preventDefault(), $(this).parent().parent().find(".button-container").slideToggle(150)
                    }), $("#show-annot").change(function() {
                        $(this).is(":checked") ? $(".annotation.no-structure").css({
                            "background-color": " #e7e7e7"
                        }) : $(".annotation.no-structure").css({
                            "background-color": " #fff"
                        })
                    }), globalData.user.enabledFeatures.document_structure_export === !0 && $("#export-all-chem").click(function(e) {
                        e.preventDefault(), $.scrollTo($("body"), 500), Export.init("document_chemistry", docData.docHash, null)
                    }), globalData.user.enabledFeatures.export_family_chemistry === !0 && $("#export-family-chem").click(function(e) {
                        e.preventDefault();
                        var t = [];
                        $.each($("#patent-family div a"), function() {
                            t.push($(this).text())
                        }), $.scrollTo($("body"), 500), Export.init("family_chemistry", docData.docHash, t)
                    })
                },
                query: function(e) {
                    "use strict";
                    $("#query-dropdown-toggle").click(function(t) {
                        t.preventDefault(), e.view.sidebar.query.show()
                    })
                }
            }
        }
    },
    search = {
        init: function() {
            "use strict";
            var e = this;
            typeof String.prototype.trim != "function" && (String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, "")
            }), this.bind(e), e.view.formBuilder.scanParams(e), typeof searchForm.smiles != "undefined" && searchForm.smiles.length > 0 && this.updateImage(searchForm.smiles)
        },
        model: {
            set: {
                normaliser: {
                    init: function(e) {
                        "use strict";
                        var t = this,
                            n = globalData.apiUrl + "/document/patents/identifier/normalized",
                            r = {
                                dev: global.dev(!1),
                                auth_token: globalData.user.token,
                                doc_ids: ""
                            };
                        t.buildNumbersToNormalise(function(i) {
                            r.doc_ids = i, e.view.normaliser.loading.show(), $.ajax({
                                type: "POST",
                                url: n,
                                dataType: "json",
                                data: r,
                                success: function(n) {
                                    t.handleResults(n, e)
                                },
                                error: function(e) {
                                    alert(e.status + ": There was a problem normalising those numbers, please try again")
                                }
                            })
                        })
                    },
                    buildNumbersToNormalise: function(e) {
                        "use strict";
                        var t = $("#normaliser-input").val(),
                            n;
                        t.indexOf(",") !== -1 && t.indexOf("\n") !== -1 ? alert("Please use either new lines or commas, not both") : (n = t.indexOf(",") === -1 ? t.split("\n").join(",") : t, e(n.replace(/(\r\n|\n|\r)/gm, "").trim()))
                    },
                    handleResults: function(e, t) {
                        "use strict";
                        var n = [],
                            r;
                        t.view.normaliser.renderQuery(e, t), $("#show-norm-results").is(":checked") ? t.view.normaliser.renderResults(e, t) : $("#sure-query").val().length > 0 ? $("#form-submit").click() : ($("#outer-container").prepend('<div class="notice error" id="normaliser-notice">The Publication Numbers you provided could not be resolved to a SureChem Patent Number (SCPN). This may be because they are currently not available in SureChem\'s patent data collection or they are not in a format handled by the SCPN resolver. Please check our <a href="http://support.surechem.com/knowledgebase/articles/93424-patent-number-search-format" target="_blank">Patent Number Search Format</a> support pages.</div>'), $.modal.close())
                    }
                }
            },
            get: {
                parent: function(e, t) {
                    "use strict";
                    var n = globalData.apiUrl + "/search/" + searchForm.child_of + "/results?auth_token=" + globalData.user.token + global.dev(!0, "&") + "&max_results=0&page=1",
                        r;
                    $.ajax({
                        type: "GET",
                        url: n,
                        dataType: "json",
                        success: function(n) {
                            r = jQuery.parseJSON(n.data.query.search_appendix), t(r[0], e)
                        }
                    })
                }
            }
        },
        view: {
            formBuilder: {
                scanParams: function(e) {
                    "use strict";
                    var t = this;
                    location.hash.indexOf("form_keys") > -1 ? t.buildObj(e) : typeof searchForm.child_of != "undefined" && searchForm.child_of.length > 0 && e.model.get.parent(e, function(e, n) {
                        t.construct(e, n)
                    })
                },
                buildObj: function(e) {
                    "use strict";
                    var t = this,
                        n = location.hash.split("&")[0].split("=")[1].split(","),
                        r = location.hash.split("&")[1].split("=")[1].split(","),
                        i = {},
                        s;
                    i.biblio = {};
                    for (s = 0; s < n.length; s++) i.biblio[n[s]] = r[s];
                    t.construct(i, e)
                },
                construct: function(e, t) {
                    "use strict";
                    var n = 0;
                    $.each(e, function(e, t) {
                        typeof t == "string" ? $("#" + e).val(t) : e === "biblio" ? $.each(t, function(e, t) {
                            n++, $("#biblio-key-" + n).val(e), $("#biblio-value-" + n).val(t)
                        }) : $.each(t, function(e, t) {
                            $("#" + e).attr({
                                checked: "checked"
                            }), (t == "search-type-identical" || "search-type-similarity") && $("#" + e).trigger("change")
                        });
                        switch (e) {
                            case "biblio":
                                $("#advanced-drop-down").slideDown(250);
                                break;
                            case "keywords":
                                $("#all-keyword-search").attr({
                                    checked: !1
                                }), $("#advanced-drop-down").slideDown(250);
                                break;
                            case $(".struct-doc-section:checked").length > 0:
                                $("#all-sections").attr({
                                    checked: !1
                                });
                                break;
                            case "field-title":
                            case "field-claims":
                            case "field-title":
                                $("#field-title").attr({
                                    checked: !1
                                });
                                break;
                            case "authorities-usapps":
                            case "authorities-usgra":
                            case "authorities-epapps":
                            case "authorities-epapps":
                            case "authorities-wo":
                            case "authorities-wo":
                                $("#authorities-all, #authorities-all-annotated").attr({
                                    checked: !1
                                });
                                break;
                            case "authorities-all":
                                $("#authorities-all-annotated").attr({
                                    checked: !1
                                });
                                break;
                            case "sim_level_single":
                                $("#sim_level_single").val(t)
                        }
                    }), t.updateImage()
                }
            },
            normaliser: {
                init: function(e) {
                    "use strict";
                    var t = this;
                    $.modal(t.buildNormaliser(), {
                        containerCss: {
                            borderColor: "#f00",
                            height: 550,
                            padding: 0,
                            width: 560
                        },
                        dataId: "normaliser-modal",
                        overlayClose: !1,
                        opacity: 20,
                        overlayCss: {
                            backgroundColor: "#000"
                        },
                        onShow: function() {
                            t.bind(e)
                        }
                    })
                },
                buildNormaliser: function() {
                    "use strict";
                    var e = [];
                    return e.push('<div id="normaliser-header"><h2>Patent number search</h2><h3>Enter Patent Publication numbers (as comma or new-line seperated list) to resolve them to the SureChem Patent Number (SCPN) format and retrieve all matching SCPNs in the SureChem patent data collection. <strong>Please do not use commas within your patent numbers.</strong></h3></div>'), e.push('<textarea name="normaliser-input" id="normaliser-input" cols="30" rows="10"></textarea>'), e.push('<div id="normaliser-footer" class="clear">'), e.push('<div id="normaliser-show-results"><input type="checkbox" value="true" name="show-norm-results" id="show-norm-results" /><label for="show-norm-results">Do not go directly to document results <a href="#" class="help-link" target="_blank">?</a></label></div>'), e.push('<div id="normaliser-actions" class="clear"><a href="#" id="cancel-normaliser" class="button left normal">Cancel and close</a><a href="#" id="normaliser-go" class="button right green">Search</a></div>'), e.push("</div>"), e.join("")
                },
                bind: function(e) {
                    "use strict";
                    var t = this;
                    $("#cancel-normaliser").click(function(e) {
                        e.preventDefault(), $.modal.close()
                    }), $("#normaliser-go").click(function(n) {
                        n.preventDefault(), t.clearForm(), e.model.set.normaliser.init(e)
                    })
                },
                clearForm: function() {
                    "use strict";
                    $("#sure-query").val(""), $("#normaliser-notice").remove()
                },
                renderResults: function(e, t) {
                    "use strict";
                    var n = this,
                        r = [],
                        i = !1;
                    $.each(e.data, function(e) {
                        this !== null ? (r.push("\n" + e + ":\n"), $.each(this, function() {
                            r.push("	" + this + "\n")
                        }), i = !0) : r.push("\n" + e + " (could not be resolved to an SCPN)\n")
                    }), n.loading.hide(), $("#normaliser-input").val(r.join("")), i && $("#outer-container").prepend('<div class="notice success" id="normaliser-notice">The Publication Numbers that were successfully resolved have been entered into the SureQuery window. Click "Search" to retrieve them.</div>')
                },
                renderQuery: function(e, t) {
                    "use strict";
                    var n = [],
                        r;
                    $.each(e.data, function(e) {
                        this !== null && $.each(this, function() {
                            n.push(this + " OR ")
                        })
                    }), r = n.join("");
                    var i = r.substr(0, r.length - 4);
                    i.length > 0 && ($("#sure-query").val("pn:(" + i + ")"), $("#authorities-all-annotated").attr("checked", !1), $("#authorities-all").attr("checked", !0))
                },
                loading: {
                    show: function() {
                        "use strict";
                        $('<div id="normaliser-loader">The numbers are being resolved</div>').insertAfter("#normaliser-header")
                    },
                    hide: function() {
                        "use strict";
                        $("#normaliser-loader").remove()
                    }
                }
            },
            draw: {
                TOOLS: {
                    chemwriter: {
                        is_default: !0,
                        ie_only: !1,
                        tool_name: "ChemWriter",
                        key: "chemwriter",
                        markup: '<iframe id="chemwriter" width="810" height="500" style="border:0px" src="/js/tools/chemwriter/index.html" frameborder="0" allowtransparency="true"></iframe>',
                        extract: function() {
                            "use strict";
                            var e = document.getElementById("chemwriter").contentWindow.editor.getMolfile(),
                                t = ["Created with ChemWriter - http://chemwriter.com", "  0  0  0  0  0  0            999 V2000", "M  END"].join("\n");
                            return e.indexOf(t) === -1 ? e : ""
                        },
                        set: function(e) {
                            "use strict";
                        }
                    },
                    marvin: {
                        is_default: !1,
                        ie_only: !0,
                        tool_name: "ChemAxon Marvin",
                        key: "marvin",
                        markup: '<iframe id="marvin" width="810" height="540" style="border:0px" src="/js/tools/marvin/dist/marvin.html" frameborder="0" allowtransparency="true"></iframe>',
                        extract: function() {
                            "use strict";
                            return document.getElementById("marvin").contentWindow.MSketch.getMol("mol")
                        },
                        set: function(e) {
                            "use strict";
                        }
                    },
                    marvinjs: {
                        is_default: !1,
                        ie_only: !1,
                        tool_name: "ChemAxon Marvin JavaScript",
                        key: "marvinjs",
                        markup: '<iframe id="marvinjs" width="795" height="480" style="border:0px" src="/js/tools/marvinjs/editor.html" frameborder="0" allowtransparency="true"></iframe>',
                        extract: function() {
                            "use strict";
                            var e = document.getElementById("marvinjs").contentWindow.marvin.sketch.exportAsMol(),
                                t = e.replace(/^\n\n/m, "[NO NAME]\n  MarvinJS                              \n");
                            return t
                        },
                        set: function(e) {
                            "use strict";
                        }
                    },
                    accelrysdraw: {
                        is_default: !1,
                        ie_only: !0,
                        tool_name: "Accelrys Draw",
                        key: "accelrysdraw",
                        markup: '<object id="adraw" codebase="MDL.Draw.Editor.dll#-1,-1,-1,-1" height="520" width="795" classid="CLSID:FCE57399-E34B-45ce-881B-5FDFF3583307"><param name="SmilesString" value=""><param name="BackColor" value="White"></object>',
                        extract: function() {
                            "use strict";
                            return document.adraw.SmilesString
                        },
                        set: function(e) {
                            "use strict";
                        },
                        onShow: function() {
                            "use strict";
                            var e = 'You need to have AccelrysDraw installed on your computer to use this drawing tool, if you do, you will asked in a moment (via a bar at the top of your browser) to allow an ActiveX plugin to start; please click the bar to allow it. This will reload the page, please click the "Draw a structure" box again to open this modal window. Then click AccelrysDraw again. You then need to double-click the white drawing area to open the tool.';
                            alert(e)
                        }
                    },
                    jdraw: {
                        is_default: !1,
                        ie_only: !0,
                        tool_name: "Accelrys JDraw",
                        key: "jdraw",
                        markup: '<iframe id="marvinjs" width="795" height="450" style="border:0px" src="/js/tools/jdraw/jdraw.html" frameborder="0" allowtransparency="true" style="margin: 10px 0px 0px 0px 5px"></iframe>',
                        extract: function() {
                            "use strict";
                            return document.getElementById("marvinjs").contentWindow.document.getElementById("myJDrawApplet").getMolString()
                        },
                        set: function(e) {
                            "use strict";
                        }
                    }
                },
                init: function() {
                    "use strict";
                    var e = this;
                    $.modal(e.buildModal(), {
                        containerCss: {
                            borderColor: "#f00",
                            height: 570,
                            padding: 0,
                            width: 810
                        },
                        overlayClose: !1,
                        opacity: 20,
                        overlayCss: {
                            backgroundColor: "#000"
                        },
                        zIndex: 6e3,
                        closeClass: "close-modal",
                        onShow: function() {
                            e.setStruct(), e.bind()
                        }
                    })
                },
                buildModal: function() {
                    "use strict";
                    var e = this;
                    return e.partial.wrap(e.partial.header(e) + e.partial.tool_markup("chemwriter", e))
                },
                setStruct: function() {
                    "use strict";
                    var e = this,
                        t = $("#struct-input").val();
                    t.indexOf("END") !== -1 && e.TOOLS.chemwriter.set(t)
                },
                getStruct: function() {
                    "use strict";
                    var e = this,
                        t = $("#drawing-tool-selector").val(),
                        n = e.TOOLS[t].extract();
                    $("#struct-input").val(n).trigger("change"), $.modal.close()
                },
                bind: function() {
                    "use strict";
                    var e = this;
                    $("#use-drawing").click(function(t) {
                        t.preventDefault(), e.getStruct()
                    }), $("#drawing-tool-selector").change(function() {
                        e.swapTool($(this).val())
                    })
                },
                swapTool: function(e) {
                    "use strict";
                    var t = this;
                    $(".drawing-tool-container").replaceWith(t.partial.tool_markup(e, t)), $(".chem-draw-tool-selector").removeClass("active"), $("#tool-" + e).addClass("active")
                },
                partial: {
                    wrap: function(e) {
                        "use strict";
                        return '<div id="chem-draw-container">' + e + "</div>"
                    },
                    header: function(e) {
                        "use strict";
                        var t = [],
                            n;
                        return t.push('<div id="draw-chem-header" class="clear">'), t.push('<div id="draw-chem-selector"><p>Select a drawing tool</p>'), t.push('<select name="drawing-tool-selector" id="drawing-tool-selector">'), $.each(e.TOOLS, function() {
                            n = this.is_default === !0 ? ' selected="selected"' : "", this.is_default === !0 && t.push('<option value="' + this.key + '"' + n + ">" + this.tool_name + "</option>"), globalData.user.enabledFeatures.extended_drawing_tools === !0 && t.push('<option value="' + this.key + '">' + this.tool_name + "</option>")
                        }), t.push("</select>"), t.push("</div>"), t.push('<div id="draw-chem-actions" class="clear">'), t.push('<a href="#" id="close-drawing" class="button left normal close-modal">Close and discard</a>'), t.push('<a href="#" id="use-drawing" class="button right green">Save and Return</a>'), t.push("</div>"), t.push("</div>"), t.join("")
                    },
                    tool_markup: function(e, t) {
                        "use strict";
                        var n = $.browser.msie;
                        return t.TOOLS[e].ie_only === !0 && typeof n == "undefined" && alert("This drawing tool requires a Java plugin to be installed in your browser. Most modern browsers (like yours) no longer allow this. If you would like to use this drawing tool, please use Internet Explorer"), typeof n != "undefined" && typeof t.TOOLS[e].onShow != "undefined" && t.TOOLS[e].onShow(), '<div id="drawing-tool-' + t.TOOLS[e].key + '" class="drawing-tool-container">' + t.TOOLS[e].markup + "</div>"
                    }
                }
            }
        },
        bind: function(e) {
            "use strict";
            var t = this;
            $(".expand").autosize(), $("#show-advanced-query").click(function(e) {
                e.preventDefault(), $("#advanced-drop-down").slideToggle(150), $(this).toggleClass("open"), $(this).hasClass("open") ? $("#sure-query").attr({
                    disabled: "disabled"
                }).val("") : ($("#sure-query").removeAttr("disabled", !1), t.clear_fielded_form())
            }), $(".non-all-keyword-search").change(function() {
                $("#all-keyword-search").removeAttr("checked")
            }), $(".authority-non-all").change(function() {
                $(".authority-all, .authority-all-annotated").removeAttr("checked")
            }), $("#all-keyword-search").change(function() {
                $(".non-all-keyword-search").removeAttr("checked")
            }), $(".authority-all").change(function() {
                $(".authority-non-all, .authority-all-annotated").removeAttr("checked")
            }), $(".authority-all-annotated").change(function() {
                $(".authority-non-all, .authority-all").removeAttr("checked")
            }), $("#direct-struct-input").click(function(e) {
                e.preventDefault(), $("#struct-container-new").slideToggle(150), $(this).toggleClass("open"), _kmq.push(["record", "Search form > Structure search > Open direct input"])
            }), $("#struct-input").change(function() {
                search.updateImage()
            }), $("#image-container").click(function(t) {
                t.preventDefault(), e.view.draw.init()
            }), $("input[name='search-type']").change(function() {
                $("#filter-cont").css({
                    opacity: 1
                }), $("#mol_filter_end").attr({
                    disabled: !1
                }), $("#mol_filter_start").attr({
                    disabled: !1
                }), $(this).attr("id") === "simil-change" ? $("#simil-choose").slideDown(150) : $("#simil-choose").slideUp(150), $(this).attr("id") === "search-type-identical" && $("#filter-cont").css({
                    opacity: .5
                }).find("#mol_filter_end, #mol_filter_start").attr({
                    disabled: !0
                })
            }), $("#sure-query").focusin(function() {
                $(this).addClass("focused"), $("#sure-query-tooltip").show().animate({
                    opacity: 1,
                    top: "-73px"
                })
            }), $("#sure-query").focusout(function() {
                $(this).removeClass("focused")
            }), $("#sure-query-tooltip .close").click(function(e) {
                e.preventDefault(), $("#sure-query-tooltip").remove()
            }), $("#remove-structure").click(function(e) {
                e.preventDefault(), $("#struct-image").remove(), $("#struct-input").val(""), $(this).hide()
            }), $("#form-submit").click(function(e) {
                e.preventDefault(), t.buildQuery()
            }), $("#clear-form").click(function(e) {
                e.preventDefault(), t.clearForm(), t.view.normaliser.clearForm()
            }), $("#normaliser-start").click(function(n) {
                n.preventDefault(), t.view.normaliser.init(e)
            }), $("#all-sections").change(function() {
                $(".struct-doc-section:not(#all-sections)").removeAttr("checked")
            }), $(".struct-doc-section:not(#all-sections)").change(function() {
                $("#all-sections").removeAttr("checked")
            })
        },
        buildQuery: function() {
            "use strict";
            var e = {},
                t, n = this,
                r = "(" + $("#authorities-all-annotated").val() + ")",
                i = $("#mol_filter_end").val(),
                s = $("#mol_filter_start").val();
            $("#struct-input").val().length === 0 && $("#sure-query").val().length === 0 && $("#keywords").val().length === 0 && $(".value-input").val().length === 0 ? alert("You haven't entered anything to search for") : (e.dev = global.dev(!1), e.child_of = searchForm.child_of, e.auth_token = globalData.user.token, e.data_source = "PATENTS", e.save_search = "yes", e.save_search_label = "", $("#struct-input").val().length !== 0 ? (e.struct = $("#struct-input").val(), e.struct_type = "smiles", e.result_type = "structures", e.struct_search_type = $("input[name=search-type]:checked").val(), $("input[name=search-type]:checked").val() === "similarity" && (e.options = "DISSIMILARITY=" + $("#sim_level_single").val()), t = "structure", e.doc_section_filter = n.structure.docSection(), e.query = search.lucene.init(t), e.query === r && (e.query = ""), e.search_appendix = search.buildFormData(t), e.max_hits = "500", globalData.user.enabledFeatures.molecular_weight_range_filter === !0 && i.length > 0 && s.length > 0 && !$("#search-type-identical").is(":checked") && (e.chem_term_filter = "mass() >= " + s + " && mass() <= " + i)) : (t = "content", e.max_hits = "250", e.query = search.lucene.init(), e.search_appendix = search.buildFormData(t)), this.submitQuery(e, t))
        },
        structure: {
            docSection: function() {
                "use strict";
                var e = "",
                    t = $(".struct-doc-section:checked");
                return $.each(t, function(t) {
                    e.length > 0 && (e += ","), e += $(this).val()
                }), e
            }
        },
        lucene: {
            init: function(e) {
                "use strict";
                var t = this.text(),
                    n = this.auths(),
                    r = this.date(),
                    i = "";
                return i = t.trim() + " AND " + n.trim(), typeof r != "undefined" && r.length > 0 && (i.substring(i.length - 4) === "AND " ? i += r : i += " AND " + r), this.clean(i)
            },
            clean: function(e) {
                "use strict";
                e = e.replace("  ", " ").trim();
                if (e.substring(0, 4) === " AND" || e.substring(0, 4) === " OR " || e.substring(0, 4) === "AND ") e = e.substring(4);
                if (e.substring(e.length - 4) === " AND" || e.substring(e.length - 4) === "AND ") e = e.substring(0, e.length - 4);
                return e.trim()
            },
            text: function() {
                "use strict";
                var e = "",
                    t = "",
                    n = "",
                    r = "",
                    i = $("#keywords"),
                    s = $("#sure-query");
                return s.val().length !== 0 ? e += "(" + s.val() + ")" : (i.val().length !== 0 && ($.each($("input[name=patent-field]:checked"), function(e) {
                    e !== 0 && (t += " OR "), $(this).val() === "ttl-ab" ? t += "ab:(" + i.val() + ") OR ttl:(" + i.val() + ")" : t += $(this).val() + ":(" + i.val() + ")"
                }), e += "(" + t + ")"), $(".value-input").val().length !== 0 && ($.each($(".biblio-field"), function(e) {
                    $(this).find(".value-input").val().length !== 0 && (n += $(this).find(".key-drop-down").val() + ":(" + $(this).find(".value-input").val() + ")", e !== $('.value-input[value!=""]').length - 1 && (n += " " + $(this).find(".boolean-select").val() + " "))
                }), r = t.length === 0 ? "" : " AND ", e += r + n.trim())), e
            },
            auths: function() {
                "use strict";
                var e = "";
                return $.each($("input[name=auths]:checked"), function(t) {
                    $(this).val().length !== 0 && (t !== 0 && (e += " OR "), e += $(this).val())
                }), e.substring(0) !== " " && (e = " " + e), $("input[name=auths]:checked").val().length !== 0 && (e = " (" + e.trim() + ")"), e
            },
            date: function() {
                "use strict";
                var e = $("#pdates").val(),
                    t = e.indexOf("TO") !== -1 && e.indexOf("[") === -1 ? "[" + e.trim() + "]" : e.trim();
                if (t.length !== 0) return "(pdates:" + t + ")"
            }
        },
        buildFormData: function(e) {
            "use strict";
            var t = {},
                n = {},
                r = [];
            return t.authorities = {}, n.authorities = {}, n.authorities.key = "Authorities searched", n.authorities.values = [], $.each($("input[name=auths]:checked"), function() {
                t.authorities[$(this).attr("id")] = "checked", n.authorities.values.push($(this).siblings(".label").text())
            }), $("#pdates").val().length > 0 && (t.pdates = $("#pdates").val(), n.pdates = "Publication Date"), $("#struct-input").val().length > 0 && (t["struct-input"] = $("#struct-input").val(), n["struct-input"] = "Input Structure", t.search_type = {}, n.search_type = {}, n.search_type.key = "Structure Search Type", n.search_type.values = [], $.each($("input[name=search-type]:checked"), function() {
                t.search_type[$(this).attr("id")] = "checked", n.search_type.values.push($(this).siblings("span").text())
            }), $("#simil-change").is(":checked") && (t.sim_level_single = 1 - $("#sim_level_single").val(), n.sim_level_single = "Tanimoto Coefficient"), t.mol_filter = $("#mol_filter_start").val() + " to " + $("#mol_filter_end").val(), n.mol_filter = "Mol Weight", t.doc_sections = {}, n.doc_sections = {}, n.doc_sections.key = "", n.doc_sections.values = [], $.each($(".struct-doc-section:not(#all-sections):checked"), function() {
                n.doc_sections.key = "Structure in Document Section(s)", t.doc_sections[$(this).attr("id")] = "checked", n.doc_sections.values.push($(this).siblings("span").text())
            })), $("#sure-query").val().length > 0 && (t["sure-query"] = $("#sure-query").val(), n["sure-query"] = "SureQuery"), $("#keywords").val().length > 0 && (t.keywords = $("#keywords").val(), n.keywords = "Keyword search", t.patent_fields = {}, n.patent_fields = {}, n.patent_fields.key = "Keyword(s) in Document Section(s)", n.patent_fields.values = [], $.each($("input[name=patent-field]:checked"), function() {
                t.patent_fields[$(this).attr("id")] = "checked", n.patent_fields.values.push($(this).siblings("span").text())
            })), $(".biblio-field .value-input").val().length > 0 && (t.biblio = {}, n.biblio = {}, $.each($(".biblio-field"), function() {
                $(this).find(".value-input").val().length > 0 && (t.biblio[$(this).find(".key-drop-down").val()] = $(this).find(".value-input").val(), n.biblio[$(this).find(".key-drop-down").val()] = $(this).find(".key-drop-down option:selected").text())
            })), r.push(t), r.push(n), JSON.stringify(r)
        },
        submitQuery: function(e, t) {
            "use strict";
            var n, r, i = "",
                s = this,
                o;
            $("#error-container").slideUp(150), $(".search-loader").show(), $("#form-submit").attr("disabled", !0), t === "structure" ? (n = globalData.apiUrl + "/search/structure", _kmq.push(["record", "Search form > Data > Search type determined: structure"])) : (n = globalData.apiUrl + "/search/content", _kmq.push(["record", "Search form > Data > Search type determined: content"])), $.ajax({
                type: "POST",
                url: n,
                dataType: "json",
                data: e,
                timeout: 9e4,
                success: function(e) {
                    var t = e.data.hash;
                    e.status === "OK" ? (_kmq.push(["record", "Search form > Data > Search submitted successfully"]), window.location = "/" + I18n.locale + "/search/status/" + t + "/") : e.status === "ERROR" && s.submitError(e.error_message, "api-returned")
                },
                statusCode: {
                    400: function(e) {
                        o = $.parseJSON(e.responseText), s.submitError(o.error_message, "400")
                    },
                    401: function() {
                        s.submitError("401 Error: We've deployed a new SureChem version, please login again to use the new features. Contact support if the problem persists.", "401")
                    },
                    404: function() {
                        s.submitError("404 Error: The API is dissappeared please try your query again, or if the problem persists submit a support request.", "404")
                    },
                    500: function() {
                        s.submitError("500 Error: The API experience a problem handling your request please try your query again, or if the problem persists submit a support request.", "500")
                    }
                }
            })
        },
        submitError: function(e, t) {
            "use strict";
            var n = "";
            t === "401" ? window.location = "/signout/" : t === "400" && (n += "<p>" + e.split("There was an error processing your search: ")[1].substring(0, 160) + ' ... <a href="#" id="show-full-error">Show full error</a></p>', n += '<div class="full-error">' + e.split("There was an error processing your search: ")[1] + "</div>"), $("#sure-query-tooltip .close").trigger("click"), $(".search-loader").hide(), $("#error-container").html("").append(n.length > 0 ? n : e).slideDown(150), $("#show-full-error").click(function(e) {
                e.preventDefault(), $(".full-error").slideToggle(200)
            }), $("#form-submit").attr("disabled", !1)
        },
        updateImage: function(e) {
            "use strict";
            var t, n;
            typeof e == "undefined" ? e = $("#struct-input").val() : $("#struct-input").val(e), e.length > 0 && (t = e.indexOf("END") !== -1 ? "mol" : "smiles", n = '<img src="https://direct.surechem.com/service/chemical/image?structure=' + encodeURIComponent(e) + "&structure_hightlight&height=297&width=296&type=" + t + '" alt="Your structure" id="struct-image" />', $("#struct-image").length === 0 ? $("#image-container").append(n) : $("#struct-image").replaceWith(n), $("#remove-structure").show())
        },
        clear_fielded_form: function() {
            "use strict";
            $("#keywords, .value-input, .key-drop-down, boolean-select").val(""), $("input[name=patent-field]").attr("checked", !1), $("#all-keyword-search").attr("checked", !0)
        },
        clearForm: function() {
            "use strict";
            var e = this;
            e.clear_fielded_form(), $("#sure-query, #struct-input, #pdates").val(""), $("#struct-image").remove(), $("#mol_filter_start").val("0"), $("#mol_filter_end").val("800")
        }
    },
    global = {
        init: function() {
            "use strict";
            this.bind(), this.tooltip(), this.ieShim()
        },
        ieShim: function() {
            typeof String.prototype.trim != "function" && (String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, "")
            }), Array.prototype.indexOf || (Array.prototype.indexOf = function(e) {
                "use strict";
                if (this == null) throw new TypeError;
                var t = Object(this),
                    n = t.length >>> 0;
                if (n === 0) return -1;
                var r = 0;
                arguments.length > 1 && (r = Number(arguments[1]), r != r ? r = 0 : r != 0 && r != Infinity && r != -Infinity && (r = (r > 0 || -1) * Math.floor(Math.abs(r))));
                if (r >= n) return -1;
                var i = r >= 0 ? r : Math.max(n - Math.abs(r), 0);
                for (; i < n; i++)
                    if (i in t && t[i] === e) return i;
                return -1
            }), Object.size = function(e) {
                var t = 0,
                    n;
                for (n in e) e.hasOwnProperty(n) && t++;
                return t
            }, typeof console == "undefined" && (console = {}, console.log = function() {
                return
            })
        },
        bind: function() {
            "use strict";
            $("#header #account a.top").click(function(e) {
                e.preventDefault(), $("#header #account-drop").toggle()
            })
        },
        tooltip: function(e) {
            "use strict";
            $(".tooltip-small").each(function() {
                var t = global.randNum(1001),
                    n = $("#tooltip-" + t),
                    r, i = function(e, t) {
                        return '<div class="tooltip-content" id="tooltip-' + e + '">' + t + "</div>"
                    };
                $(this).hover(function() {
                    $(this).append(i(t, $(this).attr("title"))), r = n.height() + 30, n.css("top", -r).show().animate({
                        opacity: 1
                    }, 300), typeof e != "undefined" && e()
                }, function() {
                    n.animate({
                        opacity: 0
                    }, 300).hide(10), $(".tooltip-content").remove()
                })
            })
        },
        loadError: function(e, t, n) {
            "use strict";
            var r = [],
                i;
            e === "404" ? i = I18n.t("global.error.404_message_html", {
                viewName: t
            }) : e === "502" || e === "500" ? i = I18n.t("global.error.502_message_html") : e === "403" && (i = I18n.t("global.error.403_message_html")), r.push('<div class="notice error doc-error clear">'), r.push("<h1>" + I18n.t("global.error.load_error") + " - " + e + '</h1><span class="error-text">' + i + '</span><br clear="both" />'), r.push('<div class="left-group"><h2>' + I18n.t("global.error.related_support") + "</h2>"), r.push("<ul>"), r.push('<li><a href="#">' + I18n.t("global.error.explantion", {
                errorName: e
            }) + "</a></li>"), r.push('<li><a href="#">' + I18n.t("global.error.cant_find", {
                viewName: t
            }) + "</a></li>"), r.push('<li><a href="#">' + I18n.t("global.error.dissappeared", {
                viewName: t
            }) + "</a></li>"), r.push('<li><a href="#">' + I18n.t("global.error.how_work", {
                viewName: t
            }) + "</a></li>"), r.push("</ul>"), r.push("</div>"), r.push('<div class="left-group"><h2>' + I18n.t("global.error.start_again") + "</h2>"), r.push('<ul><li><a href="#" onclick="window.location.reload()">' + I18n.t("global.error.reload") + '</a></li><li><a href="/search/">' + I18n.t("global.error.new_search") + "</a></ul>"), r.push("</div>"), $(".main-column").html(r.join("")), typeof n != "undefined" && n()
        },
        formatDate: function(e) {
            "use strict";
            return e.replace(/(\S{4})/g, "$1-").replace(/-$/, "").replace(/(\S{7})/g, "$1-")
        },
        formatNumber: function(e) {
            "use strict";
            var t = e.toString().split("").reverse(),
                n = "",
                r;
            for (r = 0; r <= t.length - 1; r++) n = t[r] + n, (r + 1) % 3 === 0 && t.length - 1 !== r && (n = "," + n);
            return n
        },
        dev: function(e, t) {
            "use strict";
            var n = e === !0 ? t + "dev=" : "";
            return typeof globalData.devHash != "undefined" && globalData.devHash.length > 0 ? n + globalData.devHash : ""
        },
        randNum: function(e) {
            "use strict";
            return Math.floor(Math.random() * e)
        },
        generateColour: function() {
            "use strict";
            var e = "#" + (Math.random() * 6710886 << 0).toString(16);
            return e.length === 6 && (e += "0"), e
        },
        badAuth: function() {
            "use strict";
            var e = '<div id="bad-auth-cont" class="notice error">' + I18n.t("global.bad_auth_html") + "</div>";
            $.modal(e, {
                overlayClose: !1,
                opacity: 50,
                overlayCss: {
                    backgroundColor: "#000"
                }
            })
        },
        marco: function() {
            "use strict";
            var e = typeof globalData.apiUrl != "undefined" ? globalData.apiUrl + "/marco" : "/api/marco";
            $.ajax({
                type: "GET",
                url: e,
                dataType: "json",
                timeout: 5e3,
                success: function(e) {
                    $.browser.msie || console.info("Polo!")
                },
                statusCode: {
                    503: function() {
                        global.notification("error", "503"), _kmq.push(["record", "API Status > Error > 503"])
                    },
                    502: function() {
                        global.notification("error", "502"), _kmq.push(["record", "API Status > Error > 502"])
                    },
                    500: function() {
                        global.notification("error", "500"), _kmq.push(["record", "API Status > Error > 500"])
                    },
                    404: function() {
                        global.notification("error", "503"), _kmq.push(["record", "API Status > Error > 404"])
                    }
                }
            })
        },
        notification: function(e, t) {
            "use strict";
            var n = [];
            n.push('<div id="notification-container" class="' + e + '">'), e === "error" ? n.push(I18n.t("global.notification.error", {
                error: t
            })) : n.push(t), n.push("</div>"), $("body").append(n.join("")), e !== "dark" ? $("#notification-container").animate({
                top: "55px",
                opacity: 1
            }, 750) : $("#notification-container").animate({
                top: "121px",
                opacity: 1
            }, 750)
        },
        external: function(e, t) {
            "use strict";
            var n = typeof globalData.apiUrl != "undefined" ? globalData.apiUrl + "/external/chemical/links/" + e + "?auth_token=" + globalData.user.token : "/api//external/chemical/links/" + e + "?auth_token=" + globalData.user.token,
                r = {
                    chemspider: {},
                    rsc: {},
                    pubchem: {},
                    chembl: {}
                },
                i, s;
            $.ajax({
                type: "GET",
                url: n,
                dataType: "json",
                success: function(e) {
                    e.data.chemspider_urls.length >= 1 && (r.chemspider.urls = e.data.chemspider_urls), e.data.rsc_total_hits.length >= 1 && e.data.rsc_total_hits !== "0" && (e.data.rsc_total_hits.indexOf(",") !== -1 ? (i = e.data.rsc_total_hits.split(","), s = e.data.rsc_urls.split(","), r.rsc.total = i, r.rsc.urls = s) : (r.rsc.urls = e.data.rsc_urls, r.rsc.total = e.data.rsc_total_hits)), e.data.chembl_urls.length >= 1 && (r.chembl.urls = e.data.chembl_urls), e.data.pubchem_urls.length >= 1 && (r.pubchem.urls = e.data.pubchem_urls)
                },
                complete: function() {
                    t(r)
                }
            })
        },
        edited: function(e, t) {
            "use strict";
            var n = this,
                r;
            $(".editable-replacement").focusout(function() {
                r = $(this).val(), r !== e && r.length >= 1 ? (t.text(r), $(this).replaceWith(t)) : $(this).replaceWith(t), n.makeEditable()
            })
        },
        sortObjectKeys: function(e) {
            "use strict";
            var t = [],
                n = {},
                r;
            for (r in e) e.hasOwnProperty(r) && t.push(r);
            return t.sort(), $.each(t, function(t, r) {
                n[r] = e[r]
            }), n
        }
    };
(function(e) {
    typeof define == "function" && define.amd && define.amd.jQuery ? define(["jquery"], e) : e(jQuery)
})(function(e) {
    function n(e) {
        return e
    }

    function r(e) {
        return decodeURIComponent(e.replace(t, " "))
    }

    function i(e) {
        e.indexOf('"') === 0 && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
        try {
            return s.json ? JSON.parse(e) : e
        } catch (t) {}
    }
    var t = /\+/g,
        s = e.cookie = function(t, o, u) {
            if (o !== undefined) {
                u = e.extend({}, s.defaults, u);
                if (typeof u.expires == "number") {
                    var a = u.expires,
                        f = u.expires = new Date;
                    f.setDate(f.getDate() + a)
                }
                return o = s.json ? JSON.stringify(o) : String(o), document.cookie = [encodeURIComponent(t), "=", s.raw ? o : encodeURIComponent(o), u.expires ? "; expires=" + u.expires.toUTCString() : "", u.path ? "; path=" + u.path : "", u.domain ? "; domain=" + u.domain : "", u.secure ? "; secure" : ""].join("")
            }
            var l = s.raw ? n : r,
                c = document.cookie.split("; "),
                h = t ? undefined : {};
            for (var p = 0, d = c.length; p < d; p++) {
                var v = c[p].split("="),
                    m = l(v.shift()),
                    g = l(v.join("="));
                if (t && t === m) {
                    h = i(g);
                    break
                }
                t || (h[m] = i(g))
            }
            return h
        };
    s.defaults = {}, e.removeCookie = function(t, n) {
        return e.cookie(t) !== undefined ? (e.cookie(t, "", e.extend(n, {
            expires: -1
        })), !0) : !1
    }
}),
function(e) {
    function n(e) {
        return typeof e == "object" ? e : {
            top: e,
            left: e
        }
    }
    var t = e.scrollTo = function(t, n, r) {
        e(window).scrollTo(t, n, r)
    };
    t.defaults = {
        axis: "xy",
        duration: parseFloat(e.fn.jquery) >= 1.3 ? 0 : 1,
        limit: !0
    }, t.window = function(t) {
        return e(window)._scrollable()
    }, e.fn._scrollable = function() {
        return this.map(function() {
            var t = this,
                n = !t.nodeName || e.inArray(t.nodeName.toLowerCase(), ["iframe", "#document", "html", "body"]) != -1;
            if (!n) return t;
            var r = (t.contentWindow || t).document || t.ownerDocument || t;
            return e.browser.safari || r.compatMode == "BackCompat" ? r.body : r.documentElement
        })
    }, e.fn.scrollTo = function(r, i, s) {
        typeof i == "object" && (s = i, i = 0), typeof s == "function" && (s = {
            onAfter: s
        });
        if (r == "max") r = 9e9;
        else if (jQuery(r).length == 0) return;
        return s = e.extend({}, t.defaults, s), i = i || s.duration, s.queue = s.queue && s.axis.length > 1, s.queue && (i /= 2), s.offset = n(s.offset), s.over = n(s.over), this._scrollable().each(function() {
            function h(e) {
                u.animate(l, i, s.easing, e && function() {
                    e.call(this, r, s)
                })
            }
            var o = this,
                u = e(o),
                a = r,
                f, l = {},
                c = u.is("html,body");
            switch (typeof a) {
                case "number":
                case "string":
                    if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(a)) {
                        a = n(a);
                        break
                    }
                    a = e(a, this);
                case "object":
                    if (a.is || a.style) f = (a = e(a)).offset()
            }
            e.each(s.axis.split(""), function(e, n) {
                var r = n == "x" ? "Left" : "Top",
                    i = r.toLowerCase(),
                    p = "scroll" + r,
                    d = o[p],
                    v = t.max(o, n);
                if (f) l[p] = f[i] + (c ? 0 : d - u.offset()[i]), s.margin && (l[p] -= parseInt(a.css("margin" + r)) || 0, l[p] -= parseInt(a.css("border" + r + "Width")) || 0), l[p] += s.offset[i] || 0, s.over[i] && (l[p] += a[n == "x" ? "width" : "height"]() * s.over[i]);
                else {
                    var m = a[i];
                    l[p] = m.slice && m.slice(-1) == "%" ? parseFloat(m) / 100 * v : m
                }
                s.limit && /^\d+$/.test(l[p]) && (l[p] = l[p] <= 0 ? 0 : Math.min(l[p], v)), !e && s.queue && (d != l[p] && h(s.onAfterFirst), delete l[p])
            }), h(s.onAfter)
        }).end()
    }, t.max = function(t, n) {
        var r = n == "x" ? "Width" : "Height",
            i = "scroll" + r;
        if (!e(t).is("html,body")) return t[i] - e(t)[r.toLowerCase()]();
        var s = "client" + r,
            o = t.ownerDocument.documentElement,
            u = t.ownerDocument.body;
        return Math.max(o[i], u[i]) - Math.min(o[s], u[s])
    }
}(jQuery),
function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : e(jQuery)
}(function(e) {
    var t = [],
        n = e(document),
        r = e.browser.msie && 6 === parseInt(e.browser.version) && "object" != typeof window.XMLHttpRequest,
        i = e.browser.msie && 7 === parseInt(e.browser.version),
        s = null,
        o = e(window),
        u = [];
    e.modal = function(t, n) {
        return e.modal.impl.init(t, n)
    }, e.modal.close = function() {
        e.modal.impl.close()
    }, e.modal.focus = function(t) {
        e.modal.impl.focus(t)
    }, e.modal.setContainerDimensions = function() {
        e.modal.impl.setContainerDimensions()
    }, e.modal.setPosition = function() {
        e.modal.impl.setPosition()
    }, e.modal.update = function(t, n) {
        e.modal.impl.update(t, n)
    }, e.fn.modal = function(t) {
        return e.modal.impl.init(this, t)
    }, e.modal.defaults = {
        appendTo: "body",
        focus: !0,
        opacity: 50,
        overlayId: "simplemodal-overlay",
        overlayCss: {},
        containerId: "simplemodal-container",
        containerCss: {},
        dataId: "simplemodal-data",
        dataCss: {},
        minHeight: null,
        minWidth: null,
        maxHeight: null,
        maxWidth: null,
        autoResize: !1,
        autoPosition: !0,
        zIndex: 1e3,
        close: !0,
        closeHTML: '<a class="modalCloseImg" title="Close"></a>',
        closeClass: "simplemodal-close",
        escClose: !0,
        overlayClose: !1,
        fixed: !0,
        position: null,
        persist: !1,
        modal: !0,
        onOpen: null,
        onShow: null,
        onClose: null
    }, e.modal.impl = {
        d: {},
        init: function(t, n) {
            if (this.d.data) return !1;
            s = e.browser.msie && !e.boxModel, this.o = e.extend({}, e.modal.defaults, n), this.zIndex = this.o.zIndex, this.occb = !1;
            if ("object" == typeof t) {
                if (t = t instanceof jQuery ? t : e(t), this.d.placeholder = !1, 0 < t.parent().parent().size() && (t.before(e("<span></span>").attr("id", "simplemodal-placeholder").css({
                    display: "none"
                })), this.d.placeholder = !0, this.display = t.css("display"), !this.o.persist)) this.d.orig = t.clone(!0)
            } else {
                if ("string" != typeof t && "number" != typeof t) return alert("SimpleModal Error: Unsupported data type: " + typeof t), this;
                t = e("<div></div>").html(t)
            }
            return this.create(t), this.open(), e.isFunction(this.o.onShow) && this.o.onShow.apply(this, [this.d]), this
        },
        create: function(n) {
            this.getDimensions(), this.o.modal && r && (this.d.iframe = e('<iframe src="javascript:false;"></iframe>').css(e.extend(this.o.iframeCss, {
                display: "none",
                opacity: 0,
                position: "fixed",
                height: u[0],
                width: u[1],
                zIndex: this.o.zIndex,
                top: 0,
                left: 0
            })).appendTo(this.o.appendTo)), this.d.overlay = e("<div></div>").attr("id", this.o.overlayId).addClass("simplemodal-overlay").css(e.extend(this.o.overlayCss, {
                display: "none",
                opacity: this.o.opacity / 100,
                height: this.o.modal ? t[0] : 0,
                width: this.o.modal ? t[1] : 0,
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: this.o.zIndex + 1
            })).appendTo(this.o.appendTo), this.d.container = e("<div></div>").attr("id", this.o.containerId).addClass("simplemodal-container").css(e.extend({
                position: this.o.fixed ? "fixed" : "absolute"
            }, this.o.containerCss, {
                display: "none",
                zIndex: this.o.zIndex + 2
            })).append(this.o.close && this.o.closeHTML ? e(this.o.closeHTML).addClass(this.o.closeClass) : "").appendTo(this.o.appendTo), this.d.wrap = e("<div></div>").attr("tabIndex", -1).addClass("simplemodal-wrap").css({
                height: "100%",
                outline: 0,
                width: "100%"
            }).appendTo(this.d.container), this.d.data = n.attr("id", n.attr("id") || this.o.dataId).addClass("simplemodal-data").css(e.extend(this.o.dataCss, {
                display: "none"
            })).appendTo("body"), this.setContainerDimensions(), this.d.data.appendTo(this.d.wrap), (r || s) && this.fixIE()
        },
        bindEvents: function() {
            var i = this;
            e("." + i.o.closeClass).bind("click.simplemodal", function(e) {
                e.preventDefault(), i.close()
            }), i.o.modal && i.o.close && i.o.overlayClose && i.d.overlay.bind("click.simplemodal", function(e) {
                e.preventDefault(), i.close()
            }), n.bind("keydown.simplemodal", function(e) {
                i.o.modal && 9 === e.keyCode ? i.watchTab(e) : i.o.close && i.o.escClose && 27 === e.keyCode && (e.preventDefault(), i.close())
            }), o.bind("resize.simplemodal orientationchange.simplemodal", function() {
                i.getDimensions(), i.o.autoResize ? i.setContainerDimensions() : i.o.autoPosition && i.setPosition(), r || s ? i.fixIE() : i.o.modal && (i.d.iframe && i.d.iframe.css({
                    height: u[0],
                    width: u[1]
                }), i.d.overlay.css({
                    height: t[0],
                    width: t[1]
                }))
            })
        },
        unbindEvents: function() {
            e("." + this.o.closeClass).unbind("click.simplemodal"), n.unbind("keydown.simplemodal"), o.unbind(".simplemodal"), this.d.overlay.unbind("click.simplemodal")
        },
        fixIE: function() {
            var t = this.o.position;
            e.each([this.d.iframe || null, this.o.modal ? this.d.overlay : null, "fixed" === this.d.container.css("position") ? this.d.container : null], function(e, n) {
                if (n) {
                    var r = n[0].style;
                    r.position = "absolute";
                    if (2 > e) r.removeExpression("height"), r.removeExpression("width"), r.setExpression("height", 'document.body.scrollHeight > document.body.clientHeight ? document.body.scrollHeight : document.body.clientHeight + "px"'), r.setExpression("width", 'document.body.scrollWidth > document.body.clientWidth ? document.body.scrollWidth : document.body.clientWidth + "px"');
                    else {
                        var i, s;
                        t && t.constructor === Array ? (i = t[0] ? "number" == typeof t[0] ? t[0].toString() : t[0].replace(/px/, "") : n.css("top").replace(/px/, ""), i = -1 === i.indexOf("%") ? i + ' + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"' : parseInt(i.replace(/%/, "")) + ' * ((document.documentElement.clientHeight || document.body.clientHeight) / 100) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"', t[1] && (s = "number" == typeof t[1] ? t[1].toString() : t[1].replace(/px/, ""), s = -1 === s.indexOf("%") ? s + ' + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"' : parseInt(s.replace(/%/, "")) + ' * ((document.documentElement.clientWidth || document.body.clientWidth) / 100) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"')) : (i = '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"', s = '(document.documentElement.clientWidth || document.body.clientWidth) / 2 - (this.offsetWidth / 2) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"'), r.removeExpression("top"), r.removeExpression("left"), r.setExpression("top", i), r.setExpression("left", s)
                    }
                }
            })
        },
        focus: function(t) {
            var n = this,
                t = t && -1 !== e.inArray(t, ["first", "last"]) ? t : "first",
                r = e(":input:enabled:visible:" + t, n.d.wrap);
            setTimeout(function() {
                0 < r.length ? r.focus() : n.d.wrap.focus()
            }, 10)
        },
        getDimensions: function() {
            var r = e.browser.opera && "9.5" < e.browser.version && "1.3" > e.fn.jquery || e.browser.opera && "9.5" > e.browser.version && "1.2.6" < e.fn.jquery ? o[0].innerHeight : o.height();
            t = [n.height(), n.width()], u = [r, o.width()]
        },
        getVal: function(e, t) {
            return e ? "number" == typeof e ? e : "auto" === e ? 0 : 0 < e.indexOf("%") ? parseInt(e.replace(/%/, "")) / 100 * ("h" === t ? u[0] : u[1]) : parseInt(e.replace(/px/, "")) : null
        },
        update: function(e, t) {
            if (!this.d.data) return !1;
            this.d.origHeight = this.getVal(e, "h"), this.d.origWidth = this.getVal(t, "w"), this.d.data.hide(), e && this.d.container.css("height", e), t && this.d.container.css("width", t), this.setContainerDimensions(), this.d.data.show(), this.o.focus && this.focus(), this.unbindEvents(), this.bindEvents()
        },
        setContainerDimensions: function() {
            var t = r || i,
                n = this.d.origHeight ? this.d.origHeight : e.browser.opera ? this.d.container.height() : this.getVal(t ? this.d.container[0].currentStyle.height : this.d.container.css("height"), "h"),
                t = this.d.origWidth ? this.d.origWidth : e.browser.opera ? this.d.container.width() : this.getVal(t ? this.d.container[0].currentStyle.width : this.d.container.css("width"), "w"),
                s = this.d.data.outerHeight(!0),
                o = this.d.data.outerWidth(!0);
            this.d.origHeight = this.d.origHeight || n, this.d.origWidth = this.d.origWidth || t;
            var a = this.o.maxHeight ? this.getVal(this.o.maxHeight, "h") : null,
                f = this.o.maxWidth ? this.getVal(this.o.maxWidth, "w") : null,
                a = a && a < u[0] ? a : u[0],
                f = f && f < u[1] ? f : u[1],
                c = this.o.minHeight ? this.getVal(this.o.minHeight, "h") : "auto",
                n = n ? this.o.autoResize && n > a ? a : n < c ? c : n : s ? s > a ? a : this.o.minHeight && "auto" !== c && s < c ? c : s : c,
                a = this.o.minWidth ? this.getVal(this.o.minWidth, "w") : "auto",
                t = t ? this.o.autoResize && t > f ? f : t < a ? a : t : o ? o > f ? f : this.o.minWidth && "auto" !== a && o < a ? a : o : a;
            this.d.container.css({
                height: n,
                width: t
            }), this.d.wrap.css({
                overflow: s > n || o > t ? "auto" : "visible"
            }), this.o.autoPosition && this.setPosition()
        },
        setPosition: function() {
            var e, t;
            e = u[0] / 2 - this.d.container.outerHeight(!0) / 2, t = u[1] / 2 - this.d.container.outerWidth(!0) / 2;
            var n = "fixed" !== this.d.container.css("position") ? o.scrollTop() : 0;
            this.o.position && "[object Array]" === Object.prototype.toString.call(this.o.position) ? (e = n + (this.o.position[0] || e), t = this.o.position[1] || t) : e = n + e, this.d.container.css({
                left: t,
                top: e
            })
        },
        watchTab: function(t) {
            if (0 < e(t.target).parents(".simplemodal-container").length) {
                if (this.inputs = e(":input:enabled:visible:first, :input:enabled:visible:last", this.d.data[0]), !t.shiftKey && t.target === this.inputs[this.inputs.length - 1] || t.shiftKey && t.target === this.inputs[0] || 0 === this.inputs.length) t.preventDefault(), this.focus(t.shiftKey ? "last" : "first")
            } else t.preventDefault(), this.focus()
        },
        open: function() {
            this.d.iframe && this.d.iframe.show(), e.isFunction(this.o.onOpen) ? this.o.onOpen.apply(this, [this.d]) : (this.d.overlay.show(), this.d.container.show(), this.d.data.show()), this.o.focus && this.focus(), this.bindEvents()
        },
        close: function() {
            if (!this.d.data) return !1;
            this.unbindEvents();
            if (e.isFunction(this.o.onClose) && !this.occb) this.occb = !0, this.o.onClose.apply(this, [this.d]);
            else {
                if (this.d.placeholder) {
                    var t = e("#simplemodal-placeholder");
                    this.o.persist ? t.replaceWith(this.d.data.removeClass("simplemodal-data").css("display", this.display)) : (this.d.data.hide().remove(), t.replaceWith(this.d.orig))
                } else this.d.data.hide().remove();
                this.d.container.hide().remove(), this.d.overlay.hide(), this.d.iframe && this.d.iframe.hide().remove(), this.d.overlay.remove(), this.d = {}
            }
        }
    }
}),
function(e) {
    var t = e({});
    e.subscribe = function() {
        t.on.apply(t, arguments)
    }, e.unsubscribe = function() {
        t.off.apply(t, arguments)
    }, e.publish = function() {
        t.trigger.apply(t, arguments)
    }
}(jQuery);
var JSON;
JSON || (JSON = {}),
function() {
    "use strict";

    function f(e) {
        return e < 10 ? "0" + e : e
    }

    function quote(e) {
        return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function(e) {
            var t = meta[e];
            return typeof t == "string" ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + e + '"'
    }

    function str(e, t) {
        var n, r, i, s, o = gap,
            u, a = t[e];
        a && typeof a == "object" && typeof a.toJSON == "function" && (a = a.toJSON(e)), typeof rep == "function" && (a = rep.call(t, e, a));
        switch (typeof a) {
            case "string":
                return quote(a);
            case "number":
                return isFinite(a) ? String(a) : "null";
            case "boolean":
            case "null":
                return String(a);
            case "object":
                if (!a) return "null";
                gap += indent, u = [];
                if (Object.prototype.toString.apply(a) === "[object Array]") {
                    s = a.length;
                    for (n = 0; n < s; n += 1) u[n] = str(n, a) || "null";
                    return i = u.length === 0 ? "[]" : gap ? "[\n" + gap + u.join(",\n" + gap) + "\n" + o + "]" : "[" + u.join(",") + "]", gap = o, i
                }
                if (rep && typeof rep == "object") {
                    s = rep.length;
                    for (n = 0; n < s; n += 1) typeof rep[n] == "string" && (r = rep[n], i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i))
                } else
                    for (r in a) Object.prototype.hasOwnProperty.call(a, r) && (i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i));
                return i = u.length === 0 ? "{}" : gap ? "{\n" + gap + u.join(",\n" + gap) + "\n" + o + "}" : "{" + u.join(",") + "}", gap = o, i
        }
    }
    typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = function(e) {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(e) {
        return this.valueOf()
    });
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            "\b": "\\b",
            "	": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        rep;
    typeof JSON.stringify != "function" && (JSON.stringify = function(e, t, n) {
        var r;
        gap = "", indent = "";
        if (typeof n == "number")
            for (r = 0; r < n; r += 1) indent += " ";
        else typeof n == "string" && (indent = n);
        rep = t;
        if (!t || typeof t == "function" || typeof t == "object" && typeof t.length == "number") return str("", {
            "": e
        });
        throw new Error("JSON.stringify")
    }), typeof JSON.parse != "function" && (JSON.parse = function(text, reviver) {
        function walk(e, t) {
            var n, r, i = e[t];
            if (i && typeof i == "object")
                for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (r = walk(i, n), r !== undefined ? i[n] = r : delete i[n]);
            return reviver.call(e, t, i)
        }
        var j;
        text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(e) {
            return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), typeof reviver == "function" ? walk({
            "": j
        }, "") : j;
        throw new SyntaxError("JSON.parse")
    })
}(),
function() {
    var e = {},
        t = null,
        n = null,
        r = document.title,
        i = null,
        s = null,
        o = {},
        u = {
            width: 7,
            height: 9,
            font: "10px arial",
            colour: "#ffffff",
            background: "#F03D25",
            fallback: !0
        },
        a = function() {
            var e = navigator.userAgent.toLowerCase();
            return function(t) {
                return e.indexOf(t) !== -1
            }
        }(),
        f = {
            chrome: a("chrome"),
            webkit: a("chrome") || a("safari"),
            safari: a("safari") && !a("chrome"),
            mozilla: a("mozilla") && !a("chrome") && !a("safari")
        },
        l = function() {
            var e = document.getElementsByTagName("link");
            for (var t = 0, n = e.length; t < n; t++)
                if ((e[t].getAttribute("rel") || "").match(/\bicon\b/)) return e[t];
            return !1
        },
        c = function() {
            var e = document.getElementsByTagName("link"),
                t = document.getElementsByTagName("head")[0];
            for (var n = 0, r = e.length; n < r; n++) {
                var i = typeof e[n] != "undefined";
                i && e[n].getAttribute("rel") === "icon" && t.removeChild(e[n])
            }
        },
        h = function() {
            if (!n || !t) {
                var e = l();
                n = t = e ? e.getAttribute("href") : "/favicon.ico"
            }
            return t
        },
        p = function() {
            return s || (s = document.createElement("canvas"), s.width = 16, s.height = 16), s
        },
        d = function(e) {
            c();
            var t = document.createElement("link");
            t.type = "image/x-icon", t.rel = "icon", t.href = e, document.getElementsByTagName("head")[0].appendChild(t)
        },
        v = function(e) {
            window.console && window.console.log(e)
        },
        m = function(e, t) {
            if (!p().getContext || f.safari || o.fallback === "force") return g(e);
            var n = p().getContext("2d"),
                t = t || "#000000",
                e = e || 0,
                r = h();
            i = new Image, i.onload = function() {
                n.clearRect(0, 0, 16, 16), n.drawImage(i, 0, 0, i.width, i.height, 0, 0, 16, 16), e > 0 && y(n, e, t), b()
            }, r.match(/^data/) || (i.crossOrigin = "anonymous"), i.src = r
        },
        g = function(e) {
            o.fallback && (e > 0 ? document.title = "(" + e + ") " + r : document.title = r)
        },
        y = function(e, t, n) {
            var r = (t + "").length - 1,
                i = o.width + 6 * r,
                s = 16 - i,
                u = 16 - o.height;
            e.font = (f.webkit ? "bold " : "") + o.font, e.fillStyle = o.background, e.strokeStyle = o.background, e.lineWidth = 1, e.fillRect(s, u, i - 1, o.height), e.beginPath(), e.moveTo(s - .5, u + 1), e.lineTo(s - .5, 15), e.stroke(), e.beginPath(), e.moveTo(15.5, u + 1), e.lineTo(15.5, 15), e.stroke(), e.beginPath(), e.strokeStyle = "rgba(0,0,0,0.3)", e.moveTo(s, 16), e.lineTo(15, 16), e.stroke(), e.fillStyle = o.colour, e.textAlign = "right", e.textBaseline = "top", e.fillText(t, 15, f.mozilla ? 7 : 6)
        },
        b = function() {
            if (!p().getContext) return;
            d(p().toDataURL())
        };
    e.setOptions = function(e) {
        o = {};
        for (var t in u) o[t] = e.hasOwnProperty(t) ? e[t] : u[t];
        return this
    }, e.setImage = function(e) {
        return t = e, b(), this
    }, e.setBubble = function(e, t) {
        return isNaN(parseFloat(e)) || !isFinite(e) ? v("Bubble must be a number") : (m(e, t), this)
    }, e.reset = function() {
        e.setImage(n)
    }, e.setOptions(u), window.Tinycon = e
}();
var Export = {
        EXPORT_JOB: {},
        EXPORT_MANIFEST: {
            document_chemistry: {
                ui_name: "Export structures from document",
                ui_description: "Set the structure data you would like to export from this document",
                export_description: function(e) {
                    "use strict";
                    return "Exporting structures in " + e.EXPORT_JOB.scope
                },
                options: {
                    filters: ["filter_unconverted", "mol_weight", "logp", "donor_count", "acceptor_count", "rotatable_bond_count", "ring_count", "lipinski", "is_mchem_alert", "global_frequency_vcommon", "global_frequency_common", "connected", "is_element", "singleton", "simple", "is_radical"],
                    send_as_raw_params: ["filter_unconverted"]
                },
                params: function(e) {
                    "use strict";
                    var t = {
                        type: "document chemistry",
                        kind: "document",
                        objects: e.EXPORT_JOB.scope,
                        data_source: "PATENTS",
                        chemical_metadata: "yes"
                    };
                    return $.extend(t, e.model.auth()), t
                },
                display: {
                    height: 610,
                    width: 750
                }
            },
            multiple_document_chemistry: {
                ui_name: "Export structures from this these document's",
                ui_description: "This will export all of the chemistry from all the selected document's",
                export_description: function(e) {
                    "use strict";
                    return "Exporting the chemistry for the (" + e.EXPORT_JOB.entities.length + ") selected documents"
                },
                options: {
                    filters: ["filter_unconverted", "mol_weight", "logp", "donor_count", "acceptor_count", "rotatable_bond_count", "ring_count", "lipinski", "is_mchem_alert", "global_frequency_vcommon", "global_frequency_common", "connected", "is_element", "singleton", "simple", "is_radical"],
                    send_as_raw_params: ["filter_unconverted"]
                },
                params: function(e) {
                    "use strict";
                    var t = {
                        type: "document chemistry",
                        kind: "document",
                        objects: e.EXPORT_JOB.entities.join(","),
                        data_source: "PATENTS",
                        chemical_metadata: "yes"
                    };
                    return $.extend(t, e.model.auth()), t
                },
                display: {
                    height: 610,
                    width: 750
                }
            },
            results_chemistry: {
                ui_name: "Export structures from your search results",
                ui_description: "Export all the chemical data from this set of search results",
                export_description: function(e) {
                    "use strict";
                    return "Exporting " + e.EXPORT_JOB.scope + " " + $("#results-container:first-child .total_hits_data").text() + " structure results from search " + resultsData.hash
                },
                params: function(e) {
                    "use strict";
                    var t = {
                        type: "chemistry",
                        kind: "cid",
                        search_hash: resultsData.hash,
                        data_source: "PATENTS",
                        chemical_metadata: "yes"
                    };
                    return $.extend(t, e.model.auth()), t
                },
                display: {
                    height: 173,
                    width: 650
                }
            },
            multiple_results_chemistry: {
                ui_name: "Export your selected structures",
                ui_description: "Export all the chemical data from this selected set of search results",
                export_description: function(e) {
                    "use strict";
                    return "Exporting the chemical metadata for " + e.EXPORT_JOB.entities.length + " selected structures"
                },
                options: {
                    filters: ["mol_weight", "logp", "donor_count", "acceptor_count", "rotatable_bond_count", "ring_count", "lipinski", "is_mchem_alert", "global_frequency_vcommon", "global_frequency_common", "connected", "is_element", "singleton", "simple", "is_radical"],
                    send_as_raw_params: []
                },
                params: function(e) {
                    "use strict";
                    var t = {
                        type: "chemistry",
                        kind: "smiles",
                        objects: e.EXPORT_JOB.entities.join(","),
                        data_source: "PATENTS",
                        chemical_metadata: "yes"
                    };
                    return $.extend(t, e.model.auth()), t
                },
                display: {
                    height: 580,
                    width: 750
                }
            },
            family_chemistry: {
                ui_name: "Export chemistry from this patent family",
                ui_description: "This will export the available chemistry from all patent family members",
                export_description: function(e) {
                    "use strict";
                    return "Exporting the chemistry from the family members of document " + e.EXPORT_JOB.scope
                },
                options: {
                    filters: ["filter_unconverted", "mol_weight", "logp", "donor_count", "acceptor_count", "rotatable_bond_count", "ring_count", "lipinski", "is_mchem_alert", "global_frequency_vcommon", "global_frequency_common", "connected", "is_element", "singleton", "simple", "is_radical"],
                    send_as_raw_params: ["filter_unconverted"]
                },
                params: function(e) {
                    "use strict";
                    var t = {
                        type: "document chemistry",
                        kind: "document",
                        objects: e.EXPORT_JOB.entities.join(","),
                        data_source: "PATENTS",
                        chemical_metadata: "yes"
                    };
                    return $.extend(t, e.model.auth()), t
                },
                display: {
                    height: 610,
                    width: 750
                }
            }
        },
        EXPORT_OPTIONS_MANIFEST: {
            filters: {
                constructMarkup: function(e, t, n, r, i, s, o) {
                    "use strict";
                    var u, a = s !== null ? s : "",
                        f = o === !0 ? ' checked="checked"' : "",
                        l = o === !1 ? " disabled" : "";
                    return e === "range" ? u = '<input type="checkbox" class="filter-option-toggle" value="true" name="' + n + '-toggle" id="' + n + '-toggle"' + f + ' /><label for="' + n + '-toggle">' + t + '</label><span class="input-container"><input type="text" name="' + n + '-start" id="' + n + '-start" value="' + r + '" class="text-input min-value' + l + '"' + l + ' /> to <input type="text" name="' + n + '-end" id="' + n + '-end" class="text-input max-value' + l + '" value="' + i + '"' + l + " />" + a + "</span>" : u = '<input type="checkbox" class="filter-option-toggle" value="true" name="' + n + '-toggle" id="' + n + '-toggle"' + f + ' /><label for="' + n + '-toggle">' + t + "</label>", u
                },
                constructQuery: function(e, t, n, r, i) {
                    "use strict";
                    var s, o = i !== "checked" || t === "lipinski" ? "" : "not ";
                    return e === "range" ? s = "(" + t + " between " + n + " and " + r + ")" : t === "global_frequency_common" ? s = "(global_frequency between 0 and 100)" : t === "global_frequency_vcommon" ? s = "(global_frequency between 0 and 20)" : s = "(" + o + t + ")", s
                },
                filter_unconverted: {
                    hidden: !1,
                    isDefault: !0,
                    ui_name: "Filter out names with no associated chemistry",
                    markuptype: "boolean",
                    min: null,
                    max: null,
                    customUnit: null
                },
                mol_weight: {
                    hidden: !1,
                    isDefault: !0,
                    ui_name: "Molecular Weight",
                    markuptype: "range",
                    min: "300",
                    max: "700",
                    customUnit: " Da"
                },
                logp: {
                    hidden: !1,
                    isDefault: !0,
                    ui_name: "ALogP (ChemAxon)",
                    markuptype: "range",
                    min: "-3",
                    max: "6",
                    customUnit: null
                },
                donor_count: {
                    hidden: !1,
                    isDefault: !0,
                    ui_name: "H-Bond Donor Count",
                    markuptype: "range",
                    min: "0",
                    max: "5",
                    customUnit: null
                },
                acceptor_count: {
                    hidden: !1,
                    isDefault: !0,
                    ui_name: "H-Bond Acceptor Count",
                    markuptype: "range",
                    min: "0",
                    max: "10",
                    customUnit: null
                },
                rotatable_bond_count: {
                    hidden: !1,
                    isDefault: !1,
                    ui_name: "Rotatable Bond Count",
                    markuptype: "range",
                    min: "0",
                    max: "12",
                    customUnit: null
                },
                ring_count: {
                    hidden: !1,
                    isDefault: !1,
                    ui_name: "Ring Count (largest assemblies)",
                    markuptype: "range",
                    min: "0",
                    max: "5",
                    customUnit: null
                },
                lipinski: {
                    hidden: !1,
                    isDefault: !1,
                    ui_name: "Remove Lipinski R05 Non-Compliant",
                    markuptype: "boolean",
                    min: null,
                    max: null,
                    customUnit: null
                },
                is_mchem_alert: {
                    hidden: !1,
                    isDefault: !1,
                    ui_name: "Remove Compounds with Reactive Groups",
                    markuptype: "boolean",
                    min: null,
                    max: null,
                    customUnit: null
                },
                global_frequency_vcommon: {
                    hidden: !1,
                    isDefault: !1,
                    ui_name: "Remove Very Common Compounds",
                    markuptype: "boolean",
                    min: null,
                    max: null,
                    customUnit: null
                },
                global_frequency_common: {
                    hidden: !1,
                    isDefault: !1,
                    ui_name: "Remove Common Compounds",
                    markuptype: "boolean",
                    min: null,
                    max: null,
                    customUnit: null
                },
                connected: {
                    hidden: !1,
                    isDefault: !1,
                    ui_name: "Remove MultiComponent Compounds (salts, Counter-Ions)",
                    markuptype: "boolean",
                    min: null,
                    max: null,
                    customUnit: null
                },
                is_element: {
                    hidden: !0,
                    isDefault: !0,
                    ui_name: "Remove element",
                    markuptype: "boolean",
                    min: null,
                    max: null,
                    customUnit: null
                },
                singleton: {
                    hidden: !0,
                    isDefault: !0,
                    ui_name: "Remove singleton",
                    markuptype: "boolean",
                    min: null,
                    max: null,
                    customUnit: null
                },
                simple: {
                    hidden: !0,
                    isDefault: !0,
                    ui_name: "Remove simple",
                    markuptype: "boolean",
                    min: null,
                    max: null,
                    customUnit: null
                },
                is_radical: {
                    hidden: !0,
                    isDefault: !0,
                    ui_name: "Remove is_radical",
                    markuptype: "boolean",
                    min: null,
                    max: null,
                    customUnit: null
                }
            }
        },
        init: function(e, t, n) {
            "use strict";
            var r = this,
                i = {
                    type: e,
                    scope: t,
                    entities: n
                };
            $.extend(r.EXPORT_JOB, i), r.view.optionsPanel.init(r, function(e) {
                r.view.modal.show(e, r)
            })
        },
        model: {
            set: function(e) {
                "use strict";
                var t = this,
                    n = globalData.apiUrl + "/export";
                t.generateParams(e, function(t) {
                    $.ajax({
                        type: "POST",
                        url: n,
                        dataType: "json",
                        data: t,
                        success: function(t) {
                            e.view.started.init()
                        },
                        error: function(t) {
                            e.view.submitError(t, e)
                        }
                    })
                })
            },
            generateParams: function(e, t) {
                "use strict";
                var n = e.EXPORT_MANIFEST[e.EXPORT_JOB.type].params(e),
                    r = [],
                    i, s;
                typeof e.EXPORT_MANIFEST[e.EXPORT_JOB.type].options != "undefined" && typeof e.EXPORT_MANIFEST[e.EXPORT_JOB.type].options.filters != "undefined" && ($.each($(".filter-container"), function() {
                    $(this).find(".filter-option-toggle").attr("checked") === "checked" && (i = $(this).attr("id").split("filter-")[1], s = e.EXPORT_OPTIONS_MANIFEST.filters[i], e.EXPORT_MANIFEST[e.EXPORT_JOB.type].options.send_as_raw_params.indexOf(i) === -1 ? (r.length !== 0 && r.push(" and "), r.push(e.EXPORT_OPTIONS_MANIFEST.filters.constructQuery(s.markuptype, i, $(this).find(".min-value").val(), $(this).find(".max-value").val(), $(this).find(".filter-option-toggle").attr("checked")))) : n[i] = "true")
                }), n.chemical_filters = r.join("")), t(n)
            },
            auth: function() {
                "use strict";
                var e = [];
                return globalData.user.token.length === 0 ? e.dev = global.dev(!1) : e.auth_token = globalData.user.token, e
            }
        },
        view: {
            optionsPanel: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = [];
                    r.push(n.partial.header(e)), r.push(n.partial.optionBody.init(e)), r.push(n.partial.footer.init(e)), t(r.join(""))
                },
                partial: {
                    header: function(e) {
                        "use strict";
                        return '<div id="export-header"><h2>' + e.EXPORT_MANIFEST[e.EXPORT_JOB.type].ui_name + "</h2><h3>" + e.EXPORT_MANIFEST[e.EXPORT_JOB.type].ui_description + "</h3></div>"
                    },
                    footer: {
                        init: function(e) {
                            "use strict";
                            var t = this;
                            return t.wrap(t.emailNotice() + t.buttons())
                        },
                        wrap: function(e) {
                            "use strict";
                            return '<div id="export-footer" class="clear">' + e + "</div>"
                        },
                        emailNotice: function() {
                            "use strict";
                            return '<div id="email-notice-container"><input type="checkbox" value="notify-email-true" name="notify-email" checked="checked" id="notify-email" /><label for="notify-email">Notify me by email when my export is complete</label></div>'
                        },
                        buttons: function() {
                            "use strict";
                            return '<div id="action-button-container" class="clear"><a href="#" id="cancel-export">Cancel Export and Close</a><a href="#" id="submit-export">Start Export</a></div>'
                        }
                    },
                    optionBody: {
                        init: function(e) {
                            "use strict";
                            var t = this;
                            return '<div id="export-body"><p class="description">' + e.EXPORT_MANIFEST[e.EXPORT_JOB.type].export_description(e) + "</p>" + t.renderOptions.init(e) + "</div>"
                        },
                        renderOptions: {
                            init: function(e) {
                                "use strict";
                                var t = this,
                                    n = [];
                                return n.push('<div id="export-options-metacontainer" class="clear">'), typeof e.EXPORT_MANIFEST[e.EXPORT_JOB.type].options != "undefined" && typeof e.EXPORT_MANIFEST[e.EXPORT_JOB.type].options.filters != "undefined" && n.push(t.renderFilters.init(e)), n.push("</div>"), n.join("")
                            },
                            renderFilters: {
                                init: function(e) {
                                    "use strict";
                                    var t = this,
                                        n = [],
                                        r = e.EXPORT_MANIFEST[e.EXPORT_JOB.type].options.filters,
                                        i;
                                    n.push('<div id="filters-container">'), n.push("<h3>Filter the chemistry in your export</h3>");
                                    for (i = 0; i < r.length; i++) n.push(t.renderFilter(r[i], e));
                                    return n.push("</div>"), n.join("")
                                },
                                renderFilter: function(e, t) {
                                    "use strict";
                                    var n = [],
                                        r = t.EXPORT_OPTIONS_MANIFEST.filters[e],
                                        i = r.hidden === !0 ? " hidden" : "";
                                    return n.push('<div class="filter-container clear' + i + '" id="filter-' + e + '">'), n.push(t.EXPORT_OPTIONS_MANIFEST.filters.constructMarkup(r.markuptype, r.ui_name, e, r.min, r.max, r.customUnit, r.isDefault)), n.push("</div>"), n.join("")
                                }
                            }
                        }
                    }
                }
            },
            modal: {
                show: function(e, t) {
                    "use strict";
                    var n = this;
                    $.modal(e, {
                        overlayClose: !1,
                        opacity: 30,
                        overlayCss: {
                            backgroundColor: "#000"
                        },
                        containerCss: {
                            height: t.EXPORT_MANIFEST[t.EXPORT_JOB.type].display.height,
                            padding: 0,
                            width: t.EXPORT_MANIFEST[t.EXPORT_JOB.type].display.width
                        },
                        zIndex: 8999,
                        containerId: "export-options-container",
                        onShow: function() {
                            n.bind(t)
                        }
                    })
                },
                bind: function(e) {
                    "use strict";
                    $("#cancel-export").unbind(), $("#cancel-export").click(function(e) {
                        e.preventDefault(), $.modal.close()
                    }), $("#submit-export").click(function(t) {
                        t.preventDefault(), $(this).text("Please wait...").unbind(), e.model.set(e)
                    }), $(".filter-option-toggle").change(function() {
                        $(this).attr("checked") === "checked" ? $(this).parent().find(".text-input").removeAttr("disabled").removeClass("disabled") : $(this).parent().find(".text-input").attr("disabled", "disabled").addClass("disabled")
                    })
                }
            },
            started: {
                init: function() {
                    "use strict";
                    var e = this;
                    $.modal.close(), e.showSucessTooltip()
                },
                showSucessTooltip: function() {
                    "use strict";
                    var e = [];
                    e.push('<div id="export-tooltip">'), e.push('<div id="export-tooltip-header"></div>'), e.push('<div id="export-tooltip-message">Your export has started</div>'), e.push('<div id="export-tooltip-info">You can view your exports at any time by visiting your exports page</div>'), e.push("</div>"), $("#header #controls").append(e.join("")), setTimeout(function() {
                        $("#export-tooltip").fadeOut(2e3)
                    }, 5e3)
                }
            },
            submitError: function(e, t) {
                "use strict";
                $(this).text("Start Export"), t.view.modal.bind(t)
            }
        }
    },
    RenderBiblio = {
        init: function(e) {
            "use strict";
            var t = this,
                n = e.data.contents["patent-document"],
                r = [],
                i = [];
            return typeof n["bibliographic-data"]["parties"][0] != "undefined" && (r.push("<h2>Parties</h2>"), r.push('<table id="parties-table" class="front-page-table" cellspacing="0" cellpadding="0" width="100%">'), r.push("<tr>"), r.push(t.parties.assapps.init(n, t)), r.push(t.parties.inventors.init(n, t)), r.push(t.parties.agents.init(n, t)), r.push('<td width="25%">'), r.push('<table id="sub-parties-table" class="front-page-table" cellspacing="0" cellpadding="0" width="100%">'), r.push("<tr>"), r.push(t.parties.examiners.init(n, t)), r.push("</tr>"), r.push("<tr>"), r.push(t.parties.correspondents.init(n, t)), r.push("</tr>"), r.push("</table>"), r.push("</td>"), r.push("</tr>"), r.push("</table>")), typeof n["bibliographic-data"]["technical-data"] != "undefined" && (r.push("<h2>Classifications</h2>"), r.push('<table id="classification-table" class="front-page-table" cellspacing="0" cellpadding="0" width="100%">'), r.push("<tr>"), r.push(t.classification.ipcr.init(n, t)), r.push(t.classification.cpc.init(n, t)), r.push(t.classification.ecla.init(n, t)), r.push(t.classification.us.init(n, t)), r.push(t.classification.jp.init(n, t)), r.push(t.classification.fterms.init(n, t)), r.push("</tr>"), r.push("</table>")), r.push('<table id="application-table" class="front-page-table" cellspacing="0" cellpadding="0" width="100%">'), r.push("<tr>"), r.push(t.app_pub.appref.init(n, t)), r.push(t.app_pub.priority.init(n, t)), r.push(t.app_pub.pct.init(n, t)), r.push("</tr>"), r.push("</table>"), r.push(t.designatedStates.init(n)), typeof n["bibliographic-data"]["technical-data"]["citations"][0] != "undefined" && (r.push(t.citations.patents.init(n)), r.push(t.citations.nonpatents.init(n))), r.join("")
        },
        parties: {
            partials: {
                addressBlock: function(e) {
                    "use strict";
                    var t = [];
                    return typeof e.addressbook != "undefined" && typeof e.addressbook.address != "undefined" && (typeof e["addressbook"]["address"]["country"] != "undefined" && t.push(" [" + e.addressbook.address.country.$ + "]"), t.push(' <a href="#" class="address-drop-down-toggle" title="Click for address">[+]</a>'), t.push('<div class="address-drop-down">'), $.each(e.addressbook.address, function(e, n) {
                        e !== "country" && t.push('<p class="' + e + ' address-box">' + n.$ + "</p>")
                    }), t.push("</div>")), t.join("").indexOf("<p") !== -1 ? t.join("") : t[0]
                },
                wrapTableCell: function(e, t, n, r) {
                    "use strict";
                    var i = typeof r != "undefined" && r.length !== 0 ? r : '<div class="no-content">No Data.</div>';
                    return '<td id="' + e + '" width="' + t + '"><h2>' + n + "</h2>" + i + "</td>"
                }
            },
            assapps: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = e["bibliographic-data"].parties[0],
                        i = e["bibliographic-data"]["publication-reference"][0]["document-id"].country.$,
                        s, o = [],
                        u, a = [],
                        f = [],
                        l = [],
                        c;
                    return i.indexOf("SC_HL") !== -1 && (i = i.indexOf("US") !== -1 ? "US" : "non-US"), typeof r["assignees"] != "undefined" && (s = r.assignees.assignee, s.length ? $.each(s, function(e) {
                        o.push(n.assigneeRender(this, e))
                    }) : o.push(n.assigneeRender(s, 0))), typeof r["applicants"] != "undefined" && (u = r.applicants.applicant, u.length ? $.each(u, function(e) {
                        i === "US" ? a.push(n.applicantRender(this, e)) : this["@format"] === "original" ? f.push(n.applicantRender(this, e)) : this["@format"] === "epo" && l.push(n.applicantRender(this, e))
                    }) : i === "US" ? a.push(n.applicantRender(u, 0)) : u["@format"] === "original" ? f.push(n.applicantRender(u, 0)) : u["@format"] === "epo" && l.push(n.applicantRender(u, 0)), i === "US" && a.push(n.assigneeHistory(r))), c = i === "US" ? o.join("") + a.join("") : a.join("") + f.join("") + l.join("") + o.join(""), t.parties.partials.wrapTableCell("assapps", "25%", "Assignee(s)/Applicant(s)", c)
                },
                assigneeRender: function(e, t) {
                    "use strict";
                    var n = this,
                        r = [],
                        i = function(e) {
                            var t = e.indexOf("</span>") !== -1 ? e.replace(/<\/?[^>]+(>|$)/g, "") : e;
                            return '<a href="/search/#form_keys=pa&form_values=' + t + '" target="_blank" title="Click here to search with this assignee">' + e + "</a>"
                        };
                    return r.push('<div id="' + t + '" class="item-render">'), typeof e["addressbook"]["name"] != "undefined" ? r.push(i(e.addressbook.name.$)) : typeof e["addressbook"]["last-name"] != "undefined" && r.push(i(e.addressbook["last-name"].$)), r.push(RenderBiblio.parties.partials.addressBlock(e)), r.push("</div>"), r.join("")
                },
                applicantRender: function(e, t) {
                    "use strict";
                    var n = this,
                        r = [],
                        i = function(e) {
                            var t = e.indexOf("</span>") !== -1 ? e.replace(/<\/?[^>]+(>|$)/g, "") : e;
                            return '<a href="/search/#form_keys=pa&form_values=' + t + '" target="_blank" title="Click here to search with this applicant">' + e + "</a>"
                        };
                    if (e["@format"] === "original" || e["@format"] === "epo") r.push('<div id="' + t + '" class="item-render">'), typeof e.addressbook != "undefined" && typeof e.addressbook["last-name"] != "undefined" ? r.push(i(e.addressbook["last-name"].$)) : typeof e.addressbook != "undefined" && typeof e.addressbook.name != "undefined" && r.push(i(e.addressbook.name.$)), r.push(RenderBiblio.parties.partials.addressBlock(e)), r.push("</div>");
                    return r.join("")
                },
                assigneeHistory: function(e) {
                    "use strict";
                    var t = this,
                        n = [],
                        r;
                    return typeof e["assignee-history"] != "undefined" && (r = e["assignee-history"].reassignments.reassignment, n.push("<h2>Assignee History</h2>"), r.length ? $.each(r, function(e) {
                        typeof this["assignees"]["assignee"]["addressbook"] != "undefined" && n.push(t.assigneeHistoryRender(this.assignees.assignee.addressbook, e))
                    }) : typeof r["assignees"]["assignee"]["addressbook"] != "undefined" && n.push(t.assigneeHistoryRender(r.assignees.assignee.addressbook, 0))), n.join("")
                },
                assigneeHistoryRender: function(e, t) {
                    "use strict";
                    var n = [],
                        r = typeof e["last-name"] != "undefined" ? e["last-name"] : e.name,
                        i = typeof e.address != "undefined" && typeof e.address.country != "undefined" ? " [" + e.address.country.$ + "]" : "",
                        s = function(e) {
                            var t = e.indexOf("</span>") !== -1 ? e.replace(/<\/?[^>]+(>|$)/g, "") : e;
                            return '<a href="/search/#form_keys=pa&form_values=' + e.replace(",", "") + '" target="_blank" title="Click here to search with this assignee">' + e + "</a>"
                        };
                    return n.push('<div class="item-render assignee-history">' + s(r.$) + i), typeof e["address"] != "undefined" && (n.push(' <a href="#" class="address-drop-down-toggle" title="Click for address">+</a>'), n.push('<div class="address-drop-down">'), $.each(e.address, function(e, t) {
                        n.push('<p class="' + e + ' address-box">' + t.$ + "</p>")
                    }), n.push("</div>")), n.push("</div>"), n.join("")
                }
            },
            inventors: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = [],
                        i = [],
                        s = e["bibliographic-data"].parties[0],
                        o = s.inventors,
                        u;
                    return typeof o != "undefined" && typeof o.inventor != "undefined" && (o.inventor.length ? $.each(o.inventor, function(e) {
                        this["@format"] === "original" && typeof this.addressbook != "undefined" ? r.push(n.renderInventor(this, e)) : this["@format"] === "epo" && typeof this.addressbook != "undefined" && i.push(n.renderInventor(this, e))
                    }) : o.inventor["@format"] === "original" && typeof o.inventor.addressbook != "undefined" ? r.push(n.renderInventor(o.inventor, 0)) : o.inventor["@format"] === "epo" && typeof o.inventor.addressbook != "undefined" && i.push(n.renderInventor(o.inventor, 0))), u = r.length > 0 ? r.join("") : i.join(""), t.parties.partials.wrapTableCell("inventors", "25%", "Inventor(s)", u)
                },
                renderInventor: function(e, t) {
                    "use strict";
                    var n = this,
                        r = [],
                        i = [],
                        s = function(e) {
                            var t = e.indexOf("</span>") !== -1 ? e.replace(/<\/?[^>]+(>|$)/g, "") : e;
                            return '<a href="/search/#form_keys=inv&form_values=' + t + '" target="_blank" title="Click here to search with this inventor">' + e + "</a>"
                        };
                    return r.push('<div id="' + t + '" class="item-render">'), typeof e["addressbook"]["last-name"] != "undefined" ? (i.push(e.addressbook["last-name"].$), typeof e["addressbook"]["first-name"] != "undefined" && i.push(", " + e.addressbook["first-name"].$), r.push(s(i.join("")))) : typeof e["addressbook"]["name"] != "undefined" && r.push(s(e.addressbook.name.$)), r.push(RenderBiblio.parties.partials.addressBlock(e)), r.push("</div>"), r.join("")
                }
            },
            agents: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = [],
                        i = [],
                        s = e["bibliographic-data"].parties[0],
                        o = s.agents,
                        u = function(e) {
                            var t = e.indexOf("</span>") !== -1 ? e.replace(/<\/?[^>]+(>|$)/g, "") : e;
                            return '<a href="/search/#form_keys=agt&form_values=' + t + '" target="_blank" title="Click here to search with this agent">' + e + "</a>"
                        };
                    return typeof o != "undefined" && $.each(o.agent, function(e) {
                        typeof this == "object" && (r.push('<div class="item-render">'), typeof this["name"] != "undefined" && r.push(u(this.name.$)), typeof this.addressbook != "undefined" && typeof this.addressbook.name != "undefined" && r.push(u(this.addressbook.name.$)), typeof this["last-name"] != "undefined" && (i.push(this["last-name"].$), typeof this["first-name"] != "undefined" && i.push(", " + this["first-name"].$), r.push(u(i.join(""))), typeof this["address"] != "undefined" && r.push(n.addressBlock(this.address))), typeof this.addressbook != "undefined" && typeof this.addressbook["last-name"] != "undefined" && (i.push(this.addressbook["last-name"].$), typeof this["addressbook"]["first-name"] != "undefined" && i.push(", " + this.addressbook["first-name"].$), r.push(u(i.join(""))), typeof this["addressbook"]["address"] != "undefined" && r.push(n.addressBlock(this.addressbook.address))), r.push("</div>"))
                    }), t.parties.partials.wrapTableCell("agents", "25%", "Agent(s)", r.join(""))
                },
                addressBlock: function(e) {
                    "use strict";
                    var t = [];
                    return t.push(" [" + e.country.$ + "]"), t.push(' <a href="#" class="address-drop-down-toggle" title="Click for address">[+]</a>'), t.push('<div class="address-drop-down">'), $.each(e, function(e, n) {
                        e !== "country" && t.push('<p class="' + e + ' address-box">' + n.$ + "</p>")
                    }), t.push("</div>"), t.join("").indexOf("<p") !== -1 ? t.join("") : ""
                }
            },
            examiners: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = [],
                        i = e["bibliographic-data"].parties[0],
                        s = i.examiners;
                    return typeof s != "undefined" && $.each(s.examiner, function(e) {
                        typeof e.indexOf == "function" && e.indexOf("@") === -1 && (typeof this["addressbook"] != "undefined" ? r.push(n.renderExaminer(this.addressbook)) : r.push(n.renderExaminer(this)))
                    }), t.parties.partials.wrapTableCell("examiners", "100%", "Examiner(s)", r.join(""))
                },
                renderExaminer: function(e) {
                    "use strict";
                    var t = this,
                        n = [];
                    return n.push('<div class="item-render">'), typeof e["last-name"] != "undefined" && (n.push(e["last-name"].$), typeof e["first-name"] != "undefined" && n.push(", " + e["first-name"].$), n.push(RenderBiblio.parties.partials.addressBlock(e))), n.push("</div>"), n.join("")
                }
            },
            correspondents: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = [],
                        i = e["bibliographic-data"].parties[0],
                        s, o = e["bibliographic-data"]["publication-reference"][0]["document-id"].country.$;
                    return o.indexOf("SC_HL") !== -1 && (o = o.indexOf("US") !== -1 ? "US" : "non-US"), typeof i["assignee-history"] != "undefined" && o && i["assignee-history"].reassignments.reassignment !== "undefined" && (s = i["assignee-history"].reassignments.reassignment, s.length ? $.each(s, function(e) {
                        this["correspondence-address"].length ? (console.log("here"), $.each(this["correspondence-address"], function() {
                            r.push(n.renderCorrespondent(this, e))
                        })) : (console.log(this), typeof this["correspondence-address"]["addressbook"] != "undefined" && r.push(n.renderCorrespondent(this, e)))
                    }) : r.push(n.renderCorrespondent(s["correspondence-address"], 0))), t.parties.partials.wrapTableCell("correspondent", "100%", "Correspondent(s)", r.join(""))
                },
                renderCorrespondent: function(e, t) {
                    "use strict";
                    var n = this,
                        r = [],
                        i = function(e) {
                            var t = e.indexOf("</span>") !== -1 ? e.replace(/<\/?[^>]+(>|$)/g, "") : e;
                            return '<a href="/search/#form_keys=cor&form_values=' + t + '" target="_blank" title="Click here to search with this correspondent">' + e + "</a>"
                        };
                    return typeof e["addressbook"] != "undefined" && (r.push('<div class="item-render">'), typeof e["addressbook"]["last-name"] != "undefined" && r.push(i(e.addressbook["last-name"].$)), r.push(RenderBiblio.parties.partials.addressBlock(e)), r.push("</div>")), typeof e["correspondence-address"] != "undefined" && typeof e["correspondence-address"].addressbook != "undefined" && (r.push('<div class="item-render">'), typeof e["correspondence-address"]["addressbook"]["last-name"] != "undefined" && r.push(i(e["correspondence-address"].addressbook["last-name"].$)), r.push(RenderBiblio.parties.partials.addressBlock(e)), r.push("</div>")), r.join("")
                }
            }
        },
        classification: {
            ipc: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = e["bibliographic-data"]["technical-data"],
                        i = r["classification-ipc"][0],
                        s = [];
                    return typeof i != "undefined" && (typeof i["main-classification"] != "undefined" && s.push('<span class="main">' + i["main-classification"].$ + "</span>"), typeof i["further-classification"] != "undefined" && (i["further-classification"].length ? $.each(i["further-classification"], function() {
                        s.push('<span class="further">' + this.$ + "</span>")
                    }) : s.push('<span class="further">' + i["further-classification"].$ + "</span>"))), n.wrap(s.join(""))
                },
                wrap: function(e) {
                    "use strict";
                    var t = [],
                        n = e.length !== 0 ? e : '<div class="no-content">No Data.</div>';
                    return t.push('<div class="sub-column" id="classif-ipc">'), t.push("<h2>IPC (1-7)</h2>"), t.push('<a href="#" class="address-drop-down-toggle" title="Click for IPC classification">[+]</a>'), t.push('<div class="address-drop-down">'), t.push(n), t.push("</div>"), t.join("")
                }
            },
            ipcr: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = e["bibliographic-data"]["technical-data"],
                        i = r["classifications-ipcr"],
                        s = [],
                        o;
                    return typeof i != "undefined" && typeof i[0] != "undefined" && (o = i[0]["classification-ipcr"], o.length ? $.each(o, function() {
                        s.join("").indexOf(this.$) === -1 && s.push('<span class="main-ipcr">' + this.$.split("    ")[0] + "</span>")
                    }) : s.push('<span class="main-ipcr">' + o.$.split("    ")[0] + "</span>")), s.push(t.classification.ipc.init(e, t)), t.parties.partials.wrapTableCell("classif-ipcr", "20%", "IPCR", s.join(""))
                }
            },
            cpc: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = e["bibliographic-data"]["technical-data"],
                        i = r["classifications-cpc"],
                        s = [],
                        o, u;
                    return typeof i != "undefined" && typeof i[0] != "undefined" && (o = i[0]["classification-cpc"], o.length ? $.each(o, function() {
                        s.join("").indexOf(this.$) === -1 && (u = this.$.split("    ")[0], s.push('<span class="main-cpc"><a href="http://worldwide.espacenet.com/classification?locale=en_EP#!/CPC=' + u.replace(" ", "") + '" target="_blank">' + u + "</a></span>"))
                    }) : s.push('<span class="main-cpc">' + o.$.split("    ")[0] + "</span>")), t.parties.partials.wrapTableCell("classif-cpc", "20%", "CPC", s.join(""))
                }
            },
            ecla: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = e["bibliographic-data"]["technical-data"],
                        i = r["classification-ecla"],
                        s = [],
                        o;
                    return typeof i[0] != "undefined" && (i[0]["classification-symbol"].length ? $.each(i[0]["classification-symbol"], function(e) {
                        this["@scheme"] === "EC" && s.push('<span class="scheme">' + this.$ + "</span> ")
                    }) : i[0]["classification-symbol"]["@scheme"] === "EC" && s.push('<span class="scheme">' + i[0]["classification-symbol"].$ + "</span> ")), t.parties.partials.wrapTableCell("classif-ecla", "20%", "ECLA", s.join(""))
                }
            },
            us: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = e["bibliographic-data"].length ? e["bibliographic-data"]["publication-reference"][0]["document-id"].country.$ : "",
                        i = e["bibliographic-data"]["technical-data"],
                        s = i["classification-national"][0],
                        o = [];
                    return r.indexOf("SC_HL") !== -1 && (r = r.indexOf("US") !== -1 ? "US" : "non-US"), typeof s != "undefined" && s["@country"] === "US" && (typeof s["main-classification"] != "undefined" && (s["main-classification"].length ? $.each(s["main-classification"], function() {
                        o.push("<span>" + this.$ + "</span>")
                    }) : o.push("<span>" + s["main-classification"].$ + "</span>")), typeof s["further-classification"] != "undefined" && (s["further-classification"].length ? $.each(s["further-classification"], function() {
                        o.push("<span>" + this.$ + "</span>")
                    }) : o.push("<span>" + s["further-classification"].$ + "</span>"))), r === "US" ? t.parties.partials.wrapTableCell("classif-US", "20%", "US Classification", o.join("")) : ""
                }
            },
            jp: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = e["bibliographic-data"].length ? e["bibliographic-data"]["publication-reference"][0]["document-id"].country.$ : "",
                        i = e["bibliographic-data"]["technical-data"],
                        s = i["classification-national"][0],
                        o = [];
                    return r.indexOf("SC_HL") !== -1 && (r = r.indexOf("JP") !== -1 ? "JP" : "non-JP"), typeof s != "undefined" && s["@country"] === "JP" && (typeof s["main-classification"] != "undefined" && o.push("<span>" + s["main-classification"].$ + "</span>"), typeof s["further-classification"] != "undefined" && $.each(s["further-classification"], function() {
                        o.push("<span>" + this.$ + "</span>")
                    })), typeof s != "undefined" && s["@country"] === "JP" ? t.parties.partials.wrapTableCell("classif-JP", "20%", "FI Classification", o.join("")) : ""
                }
            },
            fterms: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = e["bibliographic-data"].length ? e["bibliographic-data"]["publication-reference"][0]["document-id"].country.$ : "",
                        i = e["bibliographic-data"]["technical-data"],
                        s = [],
                        o, r;
                    return r.indexOf("SC_HL") !== -1 && (r = r.indexOf("JP") !== -1 ? "JP" : "non-JP"), typeof r != "undefined" && r === "JP" && typeof i["f-term-info"][0] != "undefined" && (o = i["f-term-info"][0]["f-terms"], $.each(o, function() {
                        $.each(this["f-term"], function() {
                            s.push("<span>" + this.$ + "</span>")
                        })
                    })), r === "JP" ? t.parties.partials.wrapTableCell("classif-fterm", "20%", "F-Terms", s.join("")) : ""
                }
            }
        },
        app_pub: {
            appref: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = e["bibliographic-data"]["application-reference"][0],
                        i = [];
                    return typeof r != "undefined" && (i.push("<span>"), i.push(r["@ucid"]), r["document-id"].date !== "undefined" && i.push(" " + r["document-id"].date.$), i.push("</span>")), t.parties.partials.wrapTableCell("application-number", "33.3%", "Application Number and Date", i.join(""))
                }
            },
            priority: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = e["bibliographic-data"]["priority-claims"][0],
                        i = [],
                        s = [],
                        o;
                    return typeof r != "undefined" && (r["priority-claim"].length ? $.each(r["priority-claim"], function() {
                        typeof this["@ucid"] != "undefined" && (this["document-id"]["@format"] === "epo" ? i.push(n.renderPriority(this)) : s.push(n.renderPriority(this)))
                    }) : typeof r["priority-claim"]["@ucid"] != "undefined" && (r["priority-claim"]["document-id"]["@format"] === "epo" ? i.push(n.renderPriority(r["priority-claim"])) : s.push(n.renderPriority(r["priority-claim"])))), o = i.length !== 0 ? i.join("") : s.join(""), t.parties.partials.wrapTableCell("priority-data", "33.3%", "Priority Data", o)
                },
                renderPriority: function(e) {
                    "use strict";
                    var t = [];
                    return t.push('<span class="pri-claim">' + e["@ucid"]), typeof e["document-id"] != "undefined" && typeof e["document-id"].date.$ != "undefined" && t.push(" " + global.formatDate(e["document-id"].date.$)), t.push("</span>"), t.join("")
                }
            },
            pct: {
                init: function(e, t) {
                    "use strict";
                    var n = this,
                        r = e["bibliographic-data"]["international-convention-data"][0],
                        i;
                    return typeof r != "undefined" && typeof r["pct-or-regional-publishing-data"] != "undefined" && (i = '<span><a href="/' + I18n.locale + "/document/" + r["pct-or-regional-publishing-data"]["@ucid"] + '/" target="_blank">' + r["pct-or-regional-publishing-data"]["@ucid"] + "</a> " + global.formatDate(r["pct-or-regional-publishing-data"]["document-id"].date.$) + "</span>"), t.parties.partials.wrapTableCell("pct-pub", "33.3%", "PCT Publication Number and Date", i)
                }
            }
        },
        designatedStates: {
            init: function(e) {
                "use strict";
                var t = this,
                    n = e["bibliographic-data"]["designated-states"][0],
                    r = [],
                    i = [],
                    s = [],
                    o;
                if (typeof n != "undefined") return typeof n["pct-designated-states"] != "undefined" && $.each(n["pct-designated-states"].country, function(e) {
                    r.push(this.$, ", ")
                }), typeof n["ep-contracting-states"] != "undefined" && $.each(n["ep-contracting-states"].country, function(e) {
                    i.push(this.$, ", ")
                }), typeof n["pct-designated-states"] != "undefined" && typeof n["pct-designated-states"].regional != "undefined" && $.each(n["pct-designated-states"].regional, function(e) {
                    $.each(this.country, function(e) {
                        s.push(this.$, ", ")
                    })
                }), o = r.join("") + i.join("") + s.join(""), t.wrap(o.substring(0, o.length - 2))
            },
            wrap: function(e) {
                "use strict";
                return '<div id="designated-states"><h2><a href="#" class="drop-down-front">Designated States <span></span></a></h2><p class="drop-cont" id="desig">' + e + "</p></div>"
            }
        },
        citations: {
            patents: {
                init: function(e) {
                    "use strict";
                    var t = this,
                        n = e["bibliographic-data"]["technical-data"].citations[0]["patent-citations"],
                        r = [];
                    if (typeof n != "undefined") return n.patcit.length ? $.each(n.patcit, function(e) {
                        r.push(t.renderPatCit(this, e))
                    }) : r.push(t.renderPatCit(n.patcit, 0)), t.wrap(r.join(""))
                },
                wrap: function(e) {
                    "use strict";
                    return '<div id="patent-citations"><h2><a href="#" class="drop-down-front">Patent Citations <span></span></a></h2><ul class="drop-cont">' + e + "</ul></div>"
                },
                renderPatCit: function(e, t) {
                    "use strict";
                    var n = [],
                        r = typeof e["@ucid"] == "undefined" ? e.country + "-" + e["doc-number"] + "-" + e.kind : e["@ucid"];
                    return n.push('<li class="patcit-' + t + '"><a href="/' + I18n.locale + "/document/" + r + '/" target="_blank">' + r + "</a>"), typeof e["sources"] != "undefined" && $.each(e.sources, function() {
                        this.length ? $.each(this, function() {
                            n.push('<span class="name-entry-patcit">, ' + this["@name"] + "</span>"), typeof this["@category"] != "undefined" && n.push(" / " + this["@category"])
                        }) : (n.push('<span class="name-entry-patcit">, ' + this["@name"] + "</span>"), typeof this["@category"] != "undefined" && n.push(" / " + this["@category"]))
                    }), n.push("</li>"), n.join("")
                }
            },
            nonpatents: {
                init: function(e) {
                    "use strict";
                    var t = this,
                        n = e["bibliographic-data"]["technical-data"].citations[0]["non-patent-citations"],
                        r = [];
                    if (typeof n != "undefined") return n.nplcit.length ? $.each(n.nplcit, function(e) {
                        r.push(t.renderNonPats(this, e))
                    }) : r.push(t.renderNonPats(n.nplcit, 0)), t.wrap(r.join(""))
                },
                wrap: function(e) {
                    "use strict";
                    return '<div id="non-patent-citations"><h2><a href="#" class="drop-down-front">Non-patent Citations <span></span></a></h2><ul class="drop-cont">' + e + "</ul></div>"
                },
                renderNonPats: function(e, t) {
                    "use strict";
                    var n = [];
                    return n.push("<li>" + e.text.$ + " / "), typeof e["sources"] != "undefined" && $.each(e.sources, function() {
                        e.length ? $.each(e, function() {
                            n.push(e["@name"] + ", ")
                        }) : n.push(e["@name"])
                    }), n.join("")
                }
            }
        }
    },
    results = {
        data: {
            totalPages: 0,
            renderingFor: 0,
            d4s_hash: "",
            query: {}
        },
        init: function() {
            "use strict";
            var e = this,
                t, n;
            _kmq.push(["record", "Results render > Init"]), e.view.generic.loader.show(), e.controller.describe(function(t, n) {
                $.each(t, function(r) {
                    e.model.attempts.total = 0, e.model.get(this, n[r], e), e.data.renderingFor = t.length
                })
            })
        },
        controller: {
            describe: function(e) {
                "use strict";
                var t = this,
                    n = [],
                    r = [],
                    i, s;
                typeof resultsData.hash != "undefined" && resultsData.hash.length > 0 ? (n.push(resultsData.hash), r.push(resultsData.pagination.root_page)) : global.loadError("404", "search"), typeof resultsData.d4s_hash != "undefined" && resultsData.d4s_hash.length > 0 && (resultsData.d4s_hash.indexOf(",") !== -1 ? (i = resultsData.d4s_hash.split(","), n.concat(i), s = resultsData.pagination.d4s_page.split(","), r.concat(s)) : (n.push(resultsData.d4s_hash), r.push(resultsData.pagination.d4s_page)));
                if (typeof e == "undefined") throw new Error("results.controller.describe callback not defined");
                e(n, r)
            },
            render: function(e, t) {
                "use strict";
                var n = t.model.cookieJar.init();
                t.data.totalPages === 0 && t.view.results.generic.query(e, t), typeof e.data.query.structure != "undefined" && e.data.query.structure.length > 0 ? ($.extend(t.data.query, e.data.query), t.view.results.structure.init(e, t, n)) : typeof e.data.query.smiles != "undefined" && e.data.query.smiles.length > 0 ? t.view.results.doc.init("d4s", e, t) : t.view.results.doc.init("keyword", e, t, n)
            },
            d4s: function(e, t, n) {
                "use strict";
                n.model.set(e, t, n)
            },
            family: function(e, t, n) {
                "use strict";
                var r = [],
                    i = {
                        dev: global.dev(!1),
                        child_of: resultsData.hash,
                        auth_token: globalData.user.token,
                        data_source: "PATENTS",
                        max_hits: "250",
                        save_search: "yes",
                        save_search_label: "",
                        query: ""
                    };
                global.notification("dark", "<span>Retrieving family members...</span><p>This should just take a few seconds</p>"), doc.model.getFamily(e, function(s) {
                    $.each(s.data[e].members, function(e) {
                        r.push(e)
                    }), i.query = "(pn:(" + r.join(" OR ") + "))", t.model.setDocSearch(i, function(e) {
                        t.model.get(e, "1", t, "32", function(e) {
                            t.view.results.family.init(e, n, t)
                        })
                    })
                })
            }
        },
        model: {
            attempts: {
                total: 0,
                max: 120
            },
            get: function(e, t, n, r, i) {
                "use strict";
                var s = this,
                    o = typeof r != "undefined" && r.length > 0 ? r : "32",
                    u = globalData.apiUrl + "/search/" + e + "/results?auth_token=" + globalData.user.token + global.dev(!0, "&") + "&page=" + t + "&max_results=" + o;
                $.ajax({
                    type: "GET",
                    url: u,
                    dataType: "json",
                    beforeSend: function(e) {
                        e.setRequestHeader("Accept", "application/vnd.surechem.direct-v1.1+json")
                    },
                    success: function(e) {
                        typeof i != "undefined" ? i(e) : (n.controller.render(e, n), _kmq.push(["record", "Results render > Successfully retrived results"]))
                    },
                    statusCode: {
                        502: function() {
                            global.loadError("502", "search"), _kmq.push(["record", "Results render > Error > 502"])
                        },
                        404: function() {
                            global.loadError("404", "search"), _kmq.push(["record", "Results render > Error > 404"])
                        },
                        403: function() {
                            global.loadError("403", "search"), _kmq.push(["record", "Results render > Error > 403"])
                        },
                        401: function() {
                            global.loadError("401", "search"), _kmq.push(["record", "Results render > Error > 401"])
                        },
                        500: function() {
                            s.error("500", e, t, n, r, i), _kmq.push(["record", "Results render > Error > 500"])
                        },
                        400: function() {
                            s.error("400", e, t, n, r, i)
                        }
                    }
                })
            },
            error: function(e, t, n, r, i, s) {
                "use strict";
                var o = this;
                o.attempts.total++, setTimeout(function() {
                    o.attempts.total < o.attempts.max ? o.get(t, n, r, i, s) : (_kmq.push(["record", "Results render > Error > Exceeded tries"]), confirm("This was a problem retrieving your search, click OK to reload the page and try again or click cancel to start a new search") ? (window.location.reload(), _kmq.push(["record", "Results render > Error > Reload from confirm"])) : (window.location = "/" + I18n.locale + "/search/", _kmq.push(["record", "Results render > Error > Start search again"])))
                }, 1e3)
            },
            set: function(e, t, n, r) {
                "use strict";
                var i = this,
                    s = $("#current-search-query"),
                    o = globalData.apiUrl + "/search/documents_for_structures",
                    u = "yes",
                    a = "PATENTS",
                    f = s.val() && s.val().length !== 0 ? s.val() : "",
                    l = {
                        dev: global.dev(!1),
                        auth_token: globalData.user.token,
                        smiles: e,
                        query: f,
                        smiles_labels: t,
                        doc_section_filter: typeof n.data.query.doc_section_filter != "undefined" && n.data.query.doc_section_filter !== null ? n.data.query.doc_section_filter : "",
                        data_source: a,
                        save_search: u
                    };
                typeof r == "undefined" && global.notification("dark", "<span>Your search is running...</span><p>Did you know: Adding a keyword query to your structure search will increase its speed</p>"), $.ajax({
                    type: "POST",
                    url: o,
                    dataType: "json",
                    data: l,
                    success: function(e) {
                        typeof r != "undefined" ? r(e) : (n.data.d4s_hash = e.data.hash, i.get(e.data.hash, "1", n), _kmq.push(["record", "Results render > d4s > Successful search start"]))
                    }
                })
            },
            setDocSearch: function(e, t) {
                "use strict";
                var n = globalData.apiUrl + "/search/content";
                $.ajax({
                    type: "POST",
                    url: n,
                    dataType: "json",
                    data: e,
                    timeout: 9e4,
                    success: function(e) {
                        t(e.data.hash)
                    }
                })
            },
            cookieJar: {
                init: function(e) {
                    "use strict";
                    var t = this,
                        n = t.checkHash(e),
                        r = t.get(n);
                    return typeof r != "undefined" ? JSON.parse(r) : r
                },
                checkHash: function(e) {
                    "use strict";
                    return typeof e != "undefined" ? e : resultsData.hash
                },
                checkPage: function(e) {
                    "use strict";
                    return typeof e != "undefined" ? e : resultsData.pagination.root_page
                },
                get: function(e) {
                    "use strict";
                    return $.cookie(e)
                },
                set: function(e, t, n) {
                    "use strict";
                    var r = this,
                        i = r.checkHash(t),
                        s = r.checkPage(n),
                        o = r.get(i),
                        u = typeof o != "undefined" ? JSON.parse(o) : {};
                    return typeof u[s] != "undefined" ? u[s].indexOf(e) === -1 && u[s].push(e) : u[s] = [e], $.cookie(i, JSON.stringify(u), {
                        path: "/"
                    })
                },
                remove: function(e, t, n) {
                    "use strict";
                    var r = this,
                        i = r.checkHash(t),
                        s = r.checkPage(n),
                        o = r.get(i),
                        u = typeof o != "undefined" ? JSON.parse(o) : {};
                    return u[s].splice(u[s].indexOf(e), 1), u[s].length === 0 && delete u[s], $.cookie(i, JSON.stringify(u))
                },
                purge: function(e) {
                    "use strict";
                    var t = this,
                        n = t.checkHash(e);
                    return $.removeCookie(n, {
                        path: "/"
                    })
                },
                getItems: function(e) {
                    "use strict";
                    var t = this,
                        n = t.checkHash(e),
                        r = JSON.parse(t.get(n)),
                        i = [];
                    return $.each(r, function() {
                        $.each(this, function() {
                            i.push(this)
                        })
                    }), i
                }
            }
        },
        view: {
            generic: {
                loader: {
                    show: function() {
                        "use strict";
                        var e = [],
                            t = $(window).outerWidth() / 2 - 117,
                            n = $(window).outerHeight() / 2 - 175;
                        $("#results-loader").css({
                            top: n + "px",
                            left: t + "px"
                        }).fadeIn(100)
                    },
                    hide: function() {
                        "use strict";
                        $("#results-loader").fadeOut(250), _kmq.push(["record", "Results render > Hide Loader"])
                    }
                }
            },
            results: {
                structure: {
                    init: function(e, t, n) {
                        "use strict";
                        var r = this,
                            i = r.render(e, t, !0, n);
                        t.view.results.generic.page.init(i, t, "structure", function() {
                            t.data.totalPages++, t.bind.results.structure(t), t.bind.results.generic(t), t.view.results.doc.partial.exports.init(!0, t), global.tooltip()
                        })
                    },
                    render: function(e, t, n, r) {
                        "use strict";
                        var i = this,
                            s = [],
                            o = $("body").hasClass("chemical-index") ? !0 : !1;
                        return e.data.results.total_hits === 0 ? s.push(t.view.results.generic.noResults()) : (s.push(t.view.results.generic.metaData("structure", e, t, !0)), s.push('<ul class="clear structure-results" id="struct-container-new">'), $.each(e.data.results.structures, function(e) {
                            s.push(i.partial.result(this, e, o, r))
                        }), s.push("</ul>"), e.data.results.total_hits > e.data.pagination.max_results && typeof n != "undefined" && n !== !1 && s.push(pagination.init(e.data.pagination, "structure", null))), typeof n != "undefined" && n !== !1 && Tinycon.setBubble(parseFloat(e.data.results.total_hits)), s.join("")
                    },
                    table: {
                        build: function(e) {
                            "use strict";
                            var t = this,
                                n = [],
                                r;
                            $(".table-check").length <= 1 && ($(".result").each(function() {
                                n.push(t.row(this))
                            }), r = t.container(n.join("")), $(r).insertAfter(".content-container.structure .meta-data"), $("#struct-container-new").hide(), $("#converted-from-matrix").addClass("open"), e.bind.results.table(e))
                        },
                        selectBoxes: function(e, t) {
                            "use strict";
                            var n = $(e + " .select-result"),
                                r = e === ".table-container" ? "#struct-container-new" : ".table-container";
                            $(r + " .select-result").attr({
                                checked: !1
                            }), $.each(n, function() {
                                this.checked === !0 && $(r + " .select-result#" + this.id).attr({
                                    checked: !0
                                })
                            }), t()
                        },
                        row: function(e) {
                            "use strict";
                            var t = $(e).attr("id"),
                                n = [];
                            return n.push('<tr id="table-' + t + '">'), $(e).find(".select-result").is(":checked") ? n.push('<td valign="middle" class="table-check"><input type="checkbox" class="select-result" checked="checked" id="' + $(e).find(".select-result").attr("id") + '"></td>') : n.push('<td valign="middle" class="table-check"><input type="checkbox" class="select-result" id="' + $(e).find(".select-result").attr("id") + '"></td>'), n.push('<td valign="middle" class="table-thumb"><img src="' + $(e).find("img").attr("src") + '" alt="' + $(e).find("img").attr("alt") + '" class="small-thumbnail" /></td>'), n.push('<td valign="middle" class="table-name">'), n.push('<div style="width: 400px"><table class="sub-table" cellspacing="0" cellpadding="0" width="400px">'), n.push("<tr><td><span>Name:</span> " + $(e).find(".main-name").text() + "</td></tr>"), n.push('<tr><td><span>SMILES:</span> <span class="smiles-value">' + $(e).find(".smiles-value").text() + "</span></td></tr>"), n.push("<tr><td><span>InChi Key:</span> " + $(e).find(".inchi-value").text() + "</td></tr>"), n.push("<tr><td><span>Inchi:</span> " + $(e).find(".inchi-full").text() + "</td></tr>"), $(e).find(".result-data").length !== 0 && n.push("<tr><td><span>Similarity:</span> " + $(e).find(".result-data a").text() + "</td></tr>"), n.push("</table></div>"), n.push("</td>"), n.push('<td valign="middle" class="table-mol">' + $(e).find(".mol-value").text() + "</td>"), n.push('<td valign="middle" class="table-external"><a href="#" class="get-external-matrix button single normal">Find this structure externally</a></td>'), n.push("</tr>"), n.join("")
                        },
                        container: function(e) {
                            "use strict";
                            var t =
                                [];
                            return t.push('<div class="table-container" id="matrix-container">'), t.push('<table class="main-table" id="converted-from-matrix" cellspacing="0" cellpadding="10">'), t.push("<tr>"), t.push('<th class="table-check" width="30px">Check</th>'), t.push('<th class="table-thumb" width="150px">Structure image</th>'), t.push('<th class="table-smiles" width="400px">Chemical information</th>'), t.push('<th class="table-mol" width="50px">Mol weight</th>'), t.push('<th class="table-external" width="100px">External resources</th>'), t.push("</tr>"), t.push(e), t.push("</table>"), t.push("</div>"), t.join("")
                        }
                    },
                    partial: {
                        result: function(e, t, n, r) {
                            "use strict";
                            var i = [],
                                s;
                            return typeof r != "undefined" && typeof r[resultsData.pagination.root_page] != "undefined" && (s = r[resultsData.pagination.root_page].indexOf(e.smiles) === -1 ? "" : 'checked="checked"'), i.push('<li id="result-' + t + '" class="result">'), i.push('<div class="tooltip-result">Click to view the documents this structure\'s within</div>'), i.push('<a href="#" class="single-result"><img src="https://direct.surechem.com/service/chemical/image?structure=' + encodeURIComponent(e.smiles) + '&structure_hightlight&height=200&width=200" alt="' + e.smiles + '" /></a>'), typeof e.similarity != "undefined" && e.similarity.toString().length > 0 && i.push('<div class="result-data"><a href="#" class="tooltip-small" title="Tanimoto Coefficent">' + e.similarity.toString().slice(0, 4) + "</a></div>"), i.push('<div class="check"><input id="resultCheck-' + t + '" type="checkbox" value="' + e.smiles + '" name="resultCheck-' + t + '" class="select-result" ' + s + "></div>"), i.push('<div class="external clear"></div>'), i.push('<div class="open"><a href="#" class="open-link tooltip-small" title="Click here for more information">+</a><a href="#" class="close-link">-</a></div>'), i.push('<div class="name">'), i.push('<div class="top"></div>'), i.push('<div class="middle">'), i.push('<em>Name</em> <span class="main-name">' + e.name + "</span>"), i.push("</div>"), i.push('<div class="bottom"></div>'), i.push("</div>"), i.push('<div class="info">'), i.push('<div class="top"></div>'), i.push('<div class="middle">'), i.push('<em>Mol Weight</em> <span class="mol-value">' + e.mol_weight.toString().slice(0, 7) + "</span>"), i.push('<em>SMILES</em> <span class="smiles-value">' + e.smiles + "</span>"), i.push('<a href="#" class="more-info">More information</a>'), i.push('<div class="hidden-info">'), i.push('<em>InChi Key</em> <span class="inchi-value">' + e.inchi_key + "</span>"), i.push('<em>InChi</em> <span class="inchi-full">' + e.inchi + "</span>"), i.push("</div>"), i.push('<div class="chem-link-cont">'), n === !1 && i.push('<a href="/' + I18n.locale + "/chemical?struct=" + encodeURIComponent(e.smiles) + '" class="chem-page-link" target="_blank">View chemical page</a>'), i.push("</div>"), i.push("</div>"), i.push('<div class="bottom"></div>'), i.push("</div>"), i.push("</li>"), i.join("")
                        },
                        resultFlyout: {
                            show: function(e, t, n) {
                                "use strict";
                                var r = "";
                                $("#results-container .result img").css("z-index", "800"), $("#" + n + " img, #" + n + " .check, #" + n + " .buttonset, #" + n + " .open").css({
                                    "z-index": "4000",
                                    display: "block"
                                }), $("#" + n + " .external").css({
                                    "z-index": "9999",
                                    display: "block"
                                }), $("#" + n + " .name").animate({
                                    opacity: 1,
                                    top: e
                                }, 350).css({
                                    "z-index": "3000"
                                }).show(), $("#" + n + " .info").animate({
                                    opacity: 1,
                                    bottom: t
                                }, 450).css({
                                    "z-index": "3000"
                                }).show(), $("#" + n + " .buttonset, #" + n + " .external").animate({
                                    opacity: 1
                                }, 450), $("#" + n + " .close-link").css("display", "block"), $("#" + n + " .external a").length === 0 && global.external($("#" + n).find(".inchi-value").text(), function(e) {
                                    typeof e.chemspider.urls != "undefined" && e.chemspider.urls.length >= 1 && (r += '<a href="' + e.chemspider.urls + '" target="_blank" class="button green external-chem tooltip-small" title="View this structure in ChemSpider">1</a>'), typeof e.rsc.total == "string" && e.rsc.total !== "0" ? r += '<a href="' + e.rsc.urls + '" target="_blank" class="button green tooltip-small" title="View results at the RSC">' + e.rsc.total + "</a>" : typeof e.rsc.total == "object" && $.each(e.rsc.total, function(t, n) {
                                        r += '<a href="' + e.rsc.urls[t] + '" target="_blank" class="button green tooltip-small" title="We found multiple results at the RSC">' + this + "</a>"
                                    }), typeof e.pubchem.urls != "undefined" && e.pubchem.urls.length >= 1 && (r += '<a href="' + e.pubchem.urls + '" target="_blank" class="button green external-chem tooltip-small" title="View this structure in PubChem">1</a>'), typeof e.chembl.urls != "undefined" && e.chembl.urls.length >= 1 && (r += '<a href="' + e.chembl.urls + '" target="_blank" class="button green external-chem tooltip-small" title="View this structure in ChEMBL">1</a>'), $("#" + n + " .external").prepend(r), global.tooltip()
                                })
                            },
                            hide: function(e) {
                                "use strict";
                                $("#" + e + " .name").animate({
                                    opacity: 0,
                                    top: "0px"
                                }, 350), $("#" + e + " .info").animate({
                                    opacity: 0,
                                    bottom: "0px"
                                }, 450), $("#" + e + " .buttonset, #" + e + " .external").animate({
                                    opacity: 0
                                }, 450), $("#" + e + " .open-link").css("display", "block")
                            }
                        }
                    }
                },
                doc: {
                    RESULT_DATA: {},
                    COOKIE_CONTENT: {},
                    init: function(e, t, n, r) {
                        "use strict";
                        var i = this,
                            s = i.render(e, t, null, n, r);
                        n.view.results.generic.page.init(s, n, e, function() {
                            n.data.totalPages++, i.partial.tdLangs.show(), e === "d4s" && (n.bind.results.d4s(n), n.view.results.d4s.stateChange(t, n)), n.bind.results.doc(n), n.bind.results.generic(n), n.view.results.doc.partial.exports.init(!0, n), global.tooltip()
                        })
                    },
                    render: function(e, t, n, r, i) {
                        "use strict";
                        var s = this,
                            o = [],
                            u = s.canonicalHash(e, t, n, r),
                            a = t.data.query.query;
                        return $.extend(s.RESULT_DATA, t), $.extend(s.COOKIE_CONTENT, i), t.data.results.total_hits === 0 ? o.push(r.view.results.generic.noResults()) : (o.push(r.view.results.generic.metaData(e, t, r, !1, e)), o.push('<div class="table-container" id="doc-main">'), o.push(s.partial.header(e)), $.each(t.data.results.documents, function(t) {
                            o.push(s.partial.result(this, t, e, a, u, r, s, i))
                        }), o.push("</table>"), o.push("</div>"), t.data.results.total_hits > t.data.pagination.max_results && e !== "d4s-chem" && o.push(pagination.init(t.data.pagination, e, u))), e !== "d4s-chem" && Tinycon.setBubble(parseFloat(t.data.results.total_hits)), o.join("")
                    },
                    canonicalHash: function(e, t, n, r) {
                        "use strict";
                        var i;
                        return n !== null ? i = n : r.data.d4s_hash.length === 0 && typeof resultsData.d4s_hash == "string" ? i = resultsData.d4s_hash : r.data.d4s_hash.length === 0 ? i = resultsData.hash : i = r.data.d4s_hash, e === "d4s" || e === "d4s-chem" ? i : null
                    },
                    partial: {
                        header: function(e) {
                            "use strict";
                            var t = [],
                                n = e === "d4s" || e === "d4s-chem" ? " d4s" : "";
                            return t.push('<table class="doc-table' + n + '" cellspacing="0" cellpadding="5px" width="100%">'), t.push("<tr>"), e !== "d4s-chem" && t.push('<th width="3%"><input type="checkbox" class="select-all-results" value="" name="select-all-results" id="select-all-results" title="Select all results on this page" /></th>'), t.push('<th width="15%">Publication Number</th>'), globalData.user.enabledFeatures.pdf_download === !0 && t.push('<th width="30px">PDF</th>'), t.push('<th width="12%">Publication Date</th>'), t.push('<th>IPCR <span class="ass-shim">Assignee/Applicant</span></th>'), (e === "d4s" || e === "d4s-chem") && t.push('<th width="20%">Structure hits</th>'), e !== "d4s-chem" && t.push('<th width="7%">Tools</th>'), t.push("</tr>"), t.join("")
                        },
                        result: function(e, t, n, r, i, s, o, u, a) {
                            "use strict";
                            var f = this,
                                l = [],
                                c = i,
                                h = o.RESULT_DATA.data.pagination.start_on + t,
                                p = typeof u != "undefined" ? u : "";
                            return l.push('<tr class="result-row" id="row-' + p + t + '">'), l.push(f.tdCheckbox(e, o)), l.push(f.tdLink(e, t, n, r, c, h)), globalData.user.enabledFeatures.pdf_download === !0 && l.push(f.pdfLink(e)), l.push(f.tdPubLink(e)), l.push(f.tdLangs.init(e, t, n, r)), (n === "d4s" || n === "d4s-chem") && l.push(f.tdStructsFound(e, t, n, r)), n !== "d4s-chem" && l.push(f.tdTools(e)), l.push("</tr>"), l.join("")
                        },
                        pdfLink: function(e) {
                            "use strict";
                            return '<td class="pdf-download-container"><a href="' + e.metadata.pdf_link + '" class="download-pdf" title="Download a PDF of this document" target="_blank"></a></td>'
                        },
                        tdCheckbox: function(e, t) {
                            "use strict";
                            var n;
                            if (typeof resultsData != "undefined") return typeof t.COOKIE_CONTENT[resultsData.pagination.root_page] != "undefined" && (n = t.COOKIE_CONTENT[resultsData.pagination.root_page].indexOf(e.doc_id) === -1 ? "" : 'checked="checked"'), '<td class="check-box"><input type="checkbox" class="select-result" value="' + e.doc_id + '" name="select-result-' + e.doc_id + '" id="select-result-' + e.doc_id + '" ' + n + " /></td>"
                        },
                        tdLink: function(e, t, n, r, i, s) {
                            "use strict";
                            var o = [],
                                u = e.doc_id;
                            return o.push('<td class="pub-title" valign="top">'), o.push('<div class="result-index">' + s + ".</div>"), o.push('<a href="/' + I18n.locale + "/document/" + u + "/"), (n === "d4s" || n === "d4s-chem" || i !== null) && o.push("search/" + i + "/"), o.push("?"), typeof r != "undefined" && r !== null && o.push("query=" + encodeURIComponent(r)), (o.join().indexOf("&") !== -1 || o.join().indexOf("query")) && o.push("&"), n === "d4s" ? o.push("root_search=" + resultsData.hash + "&root_page=" + resultsData.pagination.root_page + "&docs_for_structs_page=" + resultsData.pagination.d4s_page) : n === "d4s-chem" ? o.push("root_search=" + i + "&root_page=1") : o.push("root_search=" + resultsData.hash + "&root_page=" + resultsData.pagination.root_page), o.push('" target="_blank">' + u + "</a>"), o.push("</td>"), o.join("")
                        },
                        tdPubLink: function(e) {
                            "use strict";
                            var t = [];
                            return t.push('<td valign="top" class="pub-date">'), typeof e.metadata != "undefined" && typeof e.metadata.pd != "undefined" && t.push(global.formatDate(e.metadata.pd)), t.push("</td>"), t.join("")
                        },
                        tdLangs: {
                            init: function(e, t, n, r) {
                                "use strict";
                                var i = this,
                                    s = [],
                                    o = [];
                                return s.push('<td valign="middle" class="pub-title-2 clear">'), s.push(i.tdDocMetadata.init(e)), s.push('<div class="lang-meta">'), $.each(e.metadata, function() {
                                    this && this["@lang"] && (o.push(i.lang(this["@lang"])), s.push('<div class="lang-container" id="lang-' + this["@lang"] + '" style="display: none"><span>' + this["@lang"] + "</span>" + this.$ + "</div>"))
                                }), s.push("</div>"), o.length > 1 && (s.push('<div class="lang-selector-container">'), s.push(o.join("")), s.push("</div>")), s.push("</td>"), s.join("")
                            },
                            lang: function(e) {
                                "use strict";
                                var t = [];
                                return e !== undefined && t.push('<div id="lang-' + e + '" class="lang-selector-cont" style="display: none"><a href="#" class="lang-selector" title="Change the language of the title">' + e.toUpperCase() + "</a></div>"), t.join("")
                            },
                            show: function() {
                                "use strict";
                                $.each($("tr.result-row"), function() {
                                    $(this).find("#lang-en").length !== 0 ? ($(this).find("#lang-en").show(), $(this).find(".lang-selector-cont#lang-en").addClass("active")) : ($(this).find(".lang-container:first-child, .lang-selector-cont:first-child").show(), $(this).find(".lang-selector-cont:first-child").addClass("active"))
                                })
                            },
                            tdDocMetadata: {
                                init: function(e) {
                                    "use strict";
                                    var t = [];
                                    return t.push('<div class="doc-metadata">'), t.push('<table cellspacing="0" cellpadding="0" class="metadata-table" width="100%"><tr>'), t.push('<td class="doc-metadata-ic">' + e.metadata.ic + "</td>"), t.push('<td class="doc-metadata-pa"><a href="/search/#form_keys=pa&form_values=' + e.metadata.pa + '" title="Start search for this Assignee/Applicant">' + e.metadata.pa + "</a></td>"), t.push("</tr></table>"), t.push("</div>"), t.join("")
                                }
                            }
                        },
                        tdStructsFound: function(e, t, n, r) {
                            "use strict";
                            var i = [],
                                s = !1,
                                o = e.matched_smiles.length,
                                u, a;
                            return i.push('<td class="result-image-container" valign="top">'), $.each(e.matched_smiles, function(e) {
                                e < 3 ? (a = this.label.split(";"), u = a[1], i.push('<div class="image-container-d4s"><img src="https://direct.surechem.com/service/chemical/image?structure=' + encodeURIComponent(this.smiles) + '&structure_hightlight&height=50&width=50" alt="' + this.smiles + '" style="background-color: ' + u + '" class="image-result-d4s" title="' + this.chem_id + '" id="image-result-' + t + '" /></div>'), $("#" + a[0]).length !== 0 && $("#" + a[0] + " .check").css({
                                    "background-color": a[1]
                                }).find(".select-result").attr({
                                    checked: !0
                                })) : s === 0 && (s = !0, i.push('<div class="more-images">This document contains ' + o + " of your structure hits (only first four shown)</div>"))
                            }), i.push("</td>"), i.join("")
                        },
                        tdTools: function(e) {
                            "use strict";
                            var t = [],
                                n = [];
                            return t.push('<td class="tools-container" valign="top">'), globalData.user.enabledFeatures.export_family_chemistry === !0 && t.push('<a href="#" id="document-' + e.doc_id + '" class="button left small normal export-document" title="Export chemistry from this document"><span>Export this document</span></a>'), globalData.user.enabledFeatures.document_structure_export === !0 && t.push('<a href="#" id="family-' + e.doc_id + '" class="button right small normal family-members" title="Show family members for this document"><span>Family Members</span></a>'), t.push("</td>"), t.join("")
                        },
                        exports: {
                            init: function(e, t) {
                                "use strict";
                                var n = this,
                                    r = t.model.cookieJar.init();
                                typeof r != "undefined" && e === !0 && $("#export-selected").length === 0 && Object.size(r) > 0 && globalData.user.enabledFeatures.document_structure_export === !0 && (n.showExports(t), $(".select-result:checked").length === 0 && n.selectedNotice(r)), $(".select-result:checked").length === 0 && e !== !0 && n.hideExports()
                            },
                            showExports: function(e) {
                                "use strict";
                                var t = [],
                                    n = $(".select-result:checked").parent().attr("class") === "check-box" || $(".content-container.structure").length === 0 ? "documents" : "structures";
                                t.push('<a href="#" id="export-selected">Export Selected...</a>'), t.push('<div id="export-selected-drop-down">'), t.push("<p>Export the selected " + n + "...</p>"), n === "documents" ? (t.push('<a href="#" class="document" id="chemical-data">Chemical data</a>'), t.push('<a href="#" class="document" id="patent-meta-data">Patent metadata</a>'), t.push('<a href="#" class="document" id="document-both">Chemical data &amp; Patent metadata</a>'), t.push('<a href="#" class="help-link">View document export help</a>')) : (t.push('<a href="#" class="structure" id="chemical-metadata">Chemical metadata</a>'), t.push('<a href="#" class="help-link">View structure export help</a>')), t.push("</div>"), $("#actions-container").prepend(t.join("")), e.bind.exports.selected(e)
                            },
                            hideExports: function() {
                                "use strict";
                                $("#actions-container #export-documents-chemistry").remove()
                            },
                            selectedNotice: function(e) {
                                "use strict";
                                var t = [],
                                    n = 0,
                                    r = function(e, t) {
                                        return '<div class="notice success" id="selection-notice">There are ' + e + " other structures selected on page(s) " + t.join(", ") + "</div>"
                                    };
                                $.each(e, function(e) {
                                    t.push('<a href="' + window.location.pathname + "?page=" + e + '">' + e + "</a>"), n = this.length + n
                                }), $("#struct-container-new").length !== 0 ? $(r(n, t)).insertBefore("#struct-container-new") : $(r(n, t)).insertBefore(".table-container")
                            }
                        }
                    }
                },
                d4s: {
                    stateChange: function(e, t) {
                        "use strict";
                        var n;
                        Modernizr.history && $(".content-container").length <= 2 && window.location.href.indexOf("docs_for_structs") === -1 && (n = window.location.pathname + window.location.search + "&docs_for_structs=" + t.data.d4s_hash + "&docs_for_structs_page=" + 1, window.history.pushState(null, "Docs for Structures Search", n))
                    },
                    imageHover: function(e, t, n, r) {
                        "use strict";
                        var i = [];
                        i.push('<div class="image-hovered">'), i.push('<img src="https://direct.surechem.com/service/chemical/image?structure=' + encodeURIComponent(t) + '&structure_hightlight&height=250&width=250" alt="' + t + '" style="background-color: ' + n + '" />'), i.push("</div>"), $(i.join("")).insertBefore("#" + e);
                        if (typeof r == "undefined") throw new Error("results.view.result.d4s.imageHover callback not defined");
                        r()
                    }
                },
                generic: {
                    noResults: function() {
                        "use strict";
                        var e = '<div class="no-hits">Your search returned 0 hits<span>You can <a href="/">try another search</a> or <a href="http://support.surechem.com">submit a support ticket</a> if you believe this is an error.</span></div>';
                        return _kmq.push(["record", "Results render > No results"]), e
                    },
                    metaData: function(e, t, n, r) {
                        "use strict";
                        var i = [],
                            s;
                        return e === "d4s" ? s = "documents for structures results" : e === "d4s-chem" ? s = "documents found for selected structure" : e === "keyword" ? s = "document results" : s = e + " results", i.push('<div class="meta-data clear">'), i.push('<div class="showing_hits">'), i.push("<span>Showing </span>"), t.data.results.total_hits > t.data.pagination.max_results ? i.push('<span class="showing_hits_data">' + global.formatNumber(t.data.pagination.start_on) + "-" + global.formatNumber(t.data.pagination.start_on + t.data.pagination.max_results - 1) + "&nbsp;</span>") : i.push('<span class="showing_hits_data">' + global.formatNumber(t.data.results.total_hits) + "&nbsp;</span>"), i.push("</div>"), i.push('<div class="total_hits">'), i.push("of <span class=total_hits_data>" + global.formatNumber(t.data.results.total_hits) + "</span> total " + s), i.push("</div>"), r === !0 && (i.push('<div class="view-type clear">'), i.push("View results as: "), i.push('<a href="#" class="matrix active tooltip-small" id="matrix" title="View results in the Matrix view">Matrix</a> | '), i.push('<a href="#" class="table tooltip-small" id="table" title="View results in the Table view">Table</a>'), i.push("</div>"), $("#actions-container #export-structures, #actions-container #gtfs").fadeIn(200)), i.push('<div class="selection-tools">'), e !== "d4s" && (i.push('<a href="#" id="select-all">Select all on page</a> | '), i.push('<a href="#" id="deselect-all">Deselect all</a>')), i.push("</div>"), i.push("</div>"), i.join("")
                    },
                    page: {
                        init: function(e, t, n, r) {
                            "use strict";
                            var i = this,
                                s = $(".content-container"),
                                o = $("#results-container"),
                                u = [],
                                a = 1045,
                                f = s.length + 1,
                                l = a * f + 200,
                                c = s.length === 0 ? "centered" : "multi";
                            u.push('<div class="content-container ' + n + " " + c + '" id="page-' + f + '">'), f !== 1 && u.push('<a href="#" class="close-page tooltip-small" title="Close results sheet">Close result set</a>'), u.push(e), u.push("</div>"), s.length >= 1 && s.removeClass("centered").addClass("multi"), s.length !== 0 && ($(".outerWrapper").css({
                                width: l + "px"
                            }), o.css({
                                width: l + "px"
                            })), n !== "d4s" ? o.prepend(u.join("")) : o.append(u.join("")), _kmq.push(["record", "Results render > Results in DOM"]), t.view.generic.loader.hide(), $("#notification-container").remove(), $.scrollTo("#page-" + f, 500, {
                                offset: -300
                            });
                            if (typeof r == "undefined") throw new Error("results.view.result.generic.page.init callback not defined");
                            r()
                        },
                        remove: function(e) {
                            "use strict";
                            var t = $("#" + e),
                                n = $(".content-container"),
                                r = t.outerWidth(),
                                i = $("#results-container").outerWidth();
                            t.remove(), n.length === 1 && ($("#results-container, .outerWrapper").css({
                                width: "100%"
                            }), n.removeClass("multi").addClass("centered"), $("li.result").length !== 0 && $("li.result .check").css({
                                "background-color": "transparent"
                            }).find(".select-result").attr({
                                checked: !1
                            }))
                        }
                    },
                    query: function(e, t) {
                        "use strict";
                        var n = this,
                            r = doc.view.sidebar.query.init(e.data.query);
                        $("#current-query .drop-down").append(r).addClass("populated"), $("#fork-search-new").attr({
                            href: "/" + I18n.locale + "/search/?child_of=" + resultsData.hash
                        })
                    }
                },
                family: {
                    init: function(e, t, n) {
                        "use strict";
                        var r = this,
                            i = t.parent().parent().attr("id"),
                            s = typeof n.data.d4s_hash != "undefined" && n.data.d4s_hash.length > 0 ? n.data.d4s_hash : null,
                            o = $("#query-data").text().length > 0 ? $("#query-data").text() : "",
                            u = [],
                            a;
                        u.push(n.view.results.doc.partial.header("keyword")), $.each(e.data.results.documents, function(e) {
                            u.push(n.view.results.doc.partial.result(this, e, "keyword", o, s, n, n.view.results.doc, "family-"))
                        }), $("#notification-container").delay(350).slideUp(250, function() {
                            $("#notification-container").remove()
                        }), $(r.wrap(u.join(""))).insertAfter("#" + i), $("#" + i).addClass("darken"), n.view.results.doc.partial.tdLangs.show(), n.bind.results.family(n)
                    },
                    wrap: function(e, t) {
                        "use strict";
                        var n = this,
                            r = [];
                        return r.push('<tr class="family-row" id="family-of-' + t + '">'), r.push('<td colspan="6">'), r.push('<div class="family-container">'), r.push(n.renderToolbar()), r.push(e), r.push("</div>"), r.push("</td>"), r.push("</tr>"), r.join("")
                    },
                    renderToolbar: function() {
                        "use strict";
                        var e = [];
                        return e.push('<a href="#" class="export-family-chemistry" title="Export chemistry from this patent family"><span>Export family chemistry</span></a>'), e.push('<a href="#" class="close-family-members" title="Close these family members">x</a>'), e.join("")
                    }
                }
            }
        },
        bind: {
            results: {
                structure: function(e) {
                    "use strict";
                    $(".single-result").click(function(t) {
                        t.preventDefault();
                        var n = $(this).parent().find(".smiles-value").text(),
                            r = global.generateColour(),
                            i = $(this).parent().attr("id") + ";" + r;
                        _kmq.push(["record", "Results render > Click > Single d4s search"]), $("#" + i + " .check").css("background-color", r), e.controller.d4s(n, i, e)
                    }), $(".result .open a.open-link").click(function(t) {
                        t.preventDefault();
                        var n = "-" + $(this).parent().siblings(".name").outerHeight(),
                            r = "-" + $(this).parent().siblings(".info").outerHeight(),
                            i = $(this).parent().parent().attr("id");
                        _kmq.push(["record", "Results render > Click > Show flyout"]), $(this).hide(), e.view.results.structure.partial.resultFlyout.show(n, r, i)
                    }), $(".result .open a.close-link").click(function(t) {
                        t.preventDefault();
                        var n = $(this).parent().parent().attr("id");
                        _kmq.push(["record", "Results render > Click > Close flyout"]), $(this).hide(), e.view.results.structure.partial.resultFlyout.hide(n)
                    }), $(".more-info").click(function(e) {
                        e.preventDefault(), _kmq.push(["record", "Results render > Click > Flyout > More info"]), $(this).siblings(".hidden-info").slideToggle(150), $(this).parent().parent().css("top", "210px"), $(this).toggleClass("open-info")
                    }), $("li.result").hover(function() {
                        $(this).css({
                            "border-color": "#666",
                            "box-shadow": "0 0 5px rgba(0, 0, 0, 0.2)",
                            "-moz-box-shadow": "0 0 5px rgba(0, 0, 0, 0.2)",
                            "-webkit-box-shadow": "0 0 5px rgba(0, 0, 0, 0.2)"
                        })
                    }, function() {
                        $(this).css({
                            "border-color": "#CCC",
                            "box-shadow": "none",
                            "-moz-box-shadow": "none",
                            "-webkit-box-shadow": "none"
                        })
                    }), $(".view-type a").click(function(t) {
                        t.preventDefault();
                        var n = $(this).attr("id"),
                            r = n === "table" ? "matrix" : "table",
                            i = $("#matrix-container");
                        $(this).hasClass("active") || ($(this).addClass("active"), $(".view-type ." + r).removeClass("active"), n === "table" && i.length !== 1 ? e.view.results.structure.table.build(e) : n === "table" && i.length === 1 ? e.view.results.structure.table.selectBoxes("#struct-container-new", function() {
                            i.show(), $("#struct-container-new").hide()
                        }) : n === "matrix" && e.view.results.structure.table.selectBoxes(".table-container", function() {
                            $("#struct-container-new").show(), i.hide()
                        }))
                    }), $("#gtfs").click(function(t) {
                        t.preventDefault();
                        var n = $(".select-result:checked"),
                            r, i = [],
                            s = [],
                            o, u = [];
                        n.length !== 0 ? (_kmq.push(["record", "Results render > Click > Multi d4s search"]), n.each(function() {
                            o = global.generateColour(), r = $(this).parent().parent().attr("id") + ";" + o, s.push($(this).val()), i.push(r), u.push(o), $("#" + r.split(";")[0] + " .check").css("background-color", o)
                        }), e.controller.d4s(s.join(), i.join(), e)) : (_kmq.push(["record", "Results render > Click > Multi d4s search > Nothing selected"]), alert(I18n.t("results.select_results")))
                    }), $("#export-structures").click(function(e) {
                        e.preventDefault(), Export.init("results_chemistry", "all", null)
                    }), $(".select-result").change(function() {
                        $(this).is(":checked") ? e.model.cookieJar.set($(this).val()) : e.model.cookieJar.remove($(this).val()), e.view.results.doc.partial.exports.init($(this).is(":checked"), e)
                    }), $("#select-all").click(function(t) {
                        t.preventDefault(), $(".select-result").attr({
                            checked: !0
                        }).trigger("change"), e.view.results.doc.partial.exports.init($(this).is(":checked"), e)
                    })
                },
                doc: function(e) {
                    "use strict";
                    $(".lang-selector-container").hover(function() {
                        $(this).find(".lang-selector-cont:not(.active)").show()
                    }, function() {
                        $(this).find(".lang-selector-cont:not(.active)").hide()
                    }), $(".lang-selector").click(function(e) {
                        e.preventDefault();
                        var t = $(this).parent().attr("id");
                        $(this).parent().siblings().removeClass("active"), $(this).parent().addClass("active"), $(this).parent().parent().parent().find(".lang-container").hide(), $(this).parent().parent().parent().find("#" + t).show()
                    }), $(".tools-container .family-members").click(function(t) {
                        t.preventDefault();
                        var n = $(this).attr("id").split("family-")[1];
                        e.controller.family(n, e, $(this))
                    }), $(".tools-container .export-document").click(function(e) {
                        e.preventDefault();
                        var t = $(this).attr("id").split("document-")[1];
                        Export.init("document_chemistry", t, null)
                    }), $("#select-all").click(function(t) {
                        t.preventDefault(), $(".select-result").attr({
                            checked: !0
                        }).trigger("change"), e.view.results.doc.partial.exports.init($(this).is(":checked"), e)
                    }), $("#select-all-results").change(function() {
                        $(this).is(":checked") ? $(".select-result").attr({
                            checked: !0
                        }).trigger("change") : $(".select-result").attr({
                            checked: !1
                        }).trigger("change"), e.view.results.doc.partial.exports.init($(this).is(":checked"), e)
                    }), $(".select-result").change(function() {
                        $(this).is(":checked") ? e.model.cookieJar.set($(this).val()) : e.model.cookieJar.remove($(this).val()), e.view.results.doc.partial.exports.init($(this).is(":checked"), e)
                    })
                },
                d4s: function(e) {
                    "use strict";
                    $(".image-result-d4s").hover(function() {
                        var t = $(this).attr("src"),
                            n = $(this).attr("id"),
                            r = $(this).attr("alt"),
                            i = $(this).attr("title"),
                            s = $(this).css("background-color"),
                            o = globalData.apiUrl + "/chemical/id/" + i + "?auth_token=" + globalData.user.token + global.dev(!0, "&"),
                            u = [];
                        _kmq.push(["record", "Results render > Click > d4s > Image hover"]), e.view.results.d4s.imageHover(n, r, s, function() {
                            $.ajax({
                                type: "GET",
                                url: o,
                                dataType: "json",
                                success: function(e) {
                                    u.push('<div class="info" id="ds4-highlight-image">'), $.each(e.data, function() {
                                        u.push(this.mol_weight.toString().slice(0, 7))
                                    }), u.push("</div>"), $(".image-hovered").append(u.join(""))
                                }
                            })
                        })
                    }, function() {
                        $(".image-hovered").remove()
                    })
                },
                generic: function(e) {
                    "use strict";
                    $(".close-page").click(function(t) {
                        t.preventDefault();
                        var n;
                        e.view.results.generic.page.remove($(this).parent().attr("id")), _kmq.push(["record", "Results render > Click > Close page"]), Modernizr.history && (n = window.location.pathname + "?page=" + resultsData.pagination.root_page, window.history.pushState(null, "Docs for Structures Search", n))
                    }), $(".content-container").length <= 1 && $("#current-query .top").click(function(e) {
                        e.preventDefault(), _kmq.push(["record", "Results render > Click > Show current query"]), $(this).siblings(".drop-down").slideToggle(150), $(this).parent().toggleClass("open"), $(this).toggleClass("open")
                    }), $("#deselect-all").click(function(t) {
                        t.preventDefault(), e.model.cookieJar.purge(), $(".select-result").attr({
                            checked: !1
                        }), $("#selection-notice, #export-selected, #export-selected-drop-down").remove()
                    })
                },
                table: function(e) {
                    "use strict";
                    $(".get-external-matrix").click(function(e) {
                        e.preventDefault();
                        var t = $(this).parent().parent().attr("id"),
                            n = $(this).parent().parent().find(".inchi-value").text(),
                            r = "";
                        global.external(n, function(e) {
                            typeof e.chemspider.urls != "undefined" ? (e.chemspider.urls.length >= 1 && (r += '<a href="' + e.chemspider.urls + '" target="_blank" class="button green external-chem tooltip-small" title="View this structure in ChemSpider">1</a>'), typeof e.rsc.total == "string" && e.rsc.total !== "0" ? r += '<a href="' + e.rsc.urls + '" target="_blank" class="button green tooltip-small" title="View results at the RSC">' + e.rsc.total + "</a>" : typeof e.rsc.total == "object" && $.each(e.rsc.total, function(t, n) {
                                r += '<a href="' + e.rsc.urls[t] + '" target="_blank" class="button green tooltip-small" title="We found multiple results at the RSC">' + this + "</a>"
                            }), e.pubchem.urls.length >= 1 && (r += '<a href="' + e.pubchem.urls + '" target="_blank" class="button green external-chem tooltip-small" title="View this structure in PubChem">1</a>'), e.chembl.urls.length >= 1 && (r += '<a href="' + e.chembl.urls + '" target="_blank" class="button green external-chem tooltip-small" title="View this structure in ChEMBL">1</a>')) : r += '<div class="notice warning" style="text-align: center; font-size: 11px;">This structure was not found externally</div>', $("#" + t + " .table-external").html(r), global.tooltip()
                        })
                    })
                },
                family: function(e) {
                    "use strict";
                    $(".close-family-members").click(function(e) {
                        e.preventDefault();
                        var t = $(this).parent().parent().parent();
                        t.siblings(".darken").removeClass("darken").end().remove()
                    }), $(".family-container .export-document").click(function(e) {
                        e.preventDefault();
                        var t = $(this).attr("id").split("document-")[1];
                        Export.init("document_chemistry", t, null)
                    }), $(".lang-selector-container").hover(function() {
                        $(this).find(".lang-selector-cont:not(.active)").show()
                    }, function() {
                        $(this).find(".lang-selector-cont:not(.active)").hide()
                    }), $(".lang-selector").click(function(e) {
                        e.preventDefault();
                        var t = $(this).parent().attr("id");
                        $(this).parent().siblings().removeClass("active"), $(this).parent().addClass("active"), $(this).parent().parent().parent().find(".lang-container").hide(), $(this).parent().parent().parent().find("#" + t).show()
                    }), globalData.user.enabledFeatures.export_family_chemistry === !0 && $(".export-family-chemistry").click(function(e) {
                        e.preventDefault();
                        var t = [],
                            n = $(this).parent().parent().parent().find(".pub-title a"),
                            r = $(this).parent().parent().parent().siblings(".darken").find(".pub-title a").text();
                        $.each(n, function() {
                            t.push($(this).text())
                        }), $.scrollTo($("body"), 500), Export.init("family_chemistry", r, t)
                    })
                }
            },
            exports: {
                selected: function(e) {
                    "use strict";
                    $("#export-selected").click(function(e) {
                        e.preventDefault(), $("#export-selected-drop-down").toggle()
                    }), $(".document#chemical-data").click(function(t) {
                        t.preventDefault();
                        var n = e.model.cookieJar.getItems();
                        $("#export-selected-drop-down").hide(), Export.init("multiple_document_chemistry", "", n)
                    }), $(".structure#chemical-metadata").click(function(t) {
                        t.preventDefault();
                        var n = e.model.cookieJar.getItems();
                        $("#export-selected-drop-down").hide(), Export.init("multiple_results_chemistry", "", n)
                    })
                }
            }
        }
    },
    pagination = {
        data: {
            total_pages: "",
            current_page: "",
            hash: "",
            type: ""
        },
        init: function(e, t, n) {
            "use strict";
            var r = this;
            return r.data.total_pages = e.num_pages, r.data.current_page = e.current_page, r.data.type = t, r.data.hash = n, r.build()
        },
        build: function() {
            "use strict";
            var e = this,
                t = e.data.current_page < 3 ? 1 : e.data.current_page - 4,
                n = e.data.current_page < 3 ? 10 : e.data.current_page + 4,
                r = e.data.total_pages,
                i = e.range(t, n),
                s = [];
            return s.push('<div class="pagination-new clear">'), s.push('<div class="current">'), s.push('Page <span class="current-page">' + global.formatNumber(e.data.current_page) + '</span> of <span class="total-pages">' + global.formatNumber(e.data.total_pages) + "</span>"), s.push("</div>"), s.push('<div class="page-links">'), s.push('<ul class="clear top-container">'), e.data.current_page !== 1 && (e.data.type === "structure" || e.data.type === "keyword" ? (s.push('<li class="pag-first-page direction-main"><a href="/search/results/' + resultsData.hash + '/?page=1" class="button normal single tooltip-small" title="Go to the first page">First</a></li>'), s.push('<li class="pag-previous-page direction-main"><a href="/search/results/' + resultsData.hash + "/?page=" + (e.data.current_page - 1) + '" class="button normal single tooltip-small" title="Go to the previous page">Previous</a></li>')) : (s.push('<li class="pag-first-page direction-main"><a href="/search/results/' + resultsData.hash + "/?page=" + resultsData.pagination.root_page + "&docs_for_structs=" + e.data.hash + '&docs_for_structs_page=1" class="button normal single tooltip-small" title="Go to the first page">First</a></li>'), s.push('<li class="pag-previous-page direction-main"><a href="/search/results/' + resultsData.hash + "/?page=" + resultsData.pagination.root_page + "&docs_for_structs=" + e.data.hash + "&docs_for_structs_page=" + (e.data.current_page - 1) + '" class="button normal single tooltip-small" title="Go to the previous page">Previous</a></li>'))), s.push("<li>"), s.push('<ul class="pagination-container clear">'), s.push(e.buildRange(i)), s.push('<li class="seperator">...</li>'), s.push("<li"), this === e.data.current_page && s.push(' class="current-page"'), typeof e.data.hash != "undefined" && e.data.hash !== null ? s.push(' ><a href="/search/results/' + resultsData.hash + "/?docs_for_structs=" + e.data.hash + "&docs_for_structs_page=" + r + '" id="page-' + r + '" class="button single normal" >' + global.formatNumber(r.toString()) + "</a></li>") : s.push(' ><a href="/search/results/' + resultsData.hash + "/?page=" + r + '" id="page-' + r + '" class="button single normal" >' + global.formatNumber(r.toString()) + "</a></li>"), s.push("</ul>"), s.push("</li>"), e.data.current_page !== e.data.total_pages && (e.data.type === "structure" || e.data.type === "keyword" ? (s.push('<li class="pag-next-page direction-main"><a href="/search/results/' + resultsData.hash + "/?page=" + (e.data.current_page + 1) + '" class="button normal single tooltip-small" title="Go to the next page">Next</a></li>'), s.push('<li class="pag-last-page direction-main"><a href="/search/results/' + resultsData.hash + "/?page=" + e.data.total_pages + '" class="button normal single tooltip-small" title="Go to the last page">Last</a></li>')) : (s.push('<li class="pag-next-page direction-main"><a href="/search/results/' + resultsData.hash + "/?page=" + resultsData.pagination.root_page + "&docs_for_structs=" + e.data.hash + "&docs_for_structs_page=" + (e.data.current_page + 1) + '" class="button normal single tooltip-small" title="Go to the next page">Next</a></li>'), s.push('<li class="pag-last-page direction-main"><a href="/search/results/' + resultsData.hash + "/?page=" + resultsData.pagination.root_page + "&docs_for_structs=" + e.data.hash + "&docs_for_structs_page=" + e.data.total_pages + '" class="button normal single tooltip-small" title="Go to the last page">Last</a></li>'))), s.push("</ul>"), s.push("</div>"), s.push("</div>"), s.join("")
        },
        buildRange: function(e) {
            "use strict";
            var t = [],
                n = this;
            return $.each(e, function() {
                this > 0 && this < n.data.total_pages && (t.push("<li"), this === n.data.current_page && t.push(' class="current-page"'), n.data.type === "structure" || n.data.type === "keyword" ? t.push(' ><a href="/search/results/' + resultsData.hash + "/?page=" + this + '" id="pagination-page-' +
                    this + '" class="button single normal" >' + global.formatNumber(this.toString()) + "</a></li>") : t.push(' ><a href="/search/results/' + resultsData.hash + "/?page=" + resultsData.pagination.root_page + "&docs_for_structs=" + n.data.hash + "&docs_for_structs_page=" + this + '" id="pagination-page-' + this + '" class="button single normal" >' + global.formatNumber(this.toString()) + "</a></li>"))
            }), t.join("")
        },
        range: function(e, t, n) {
            "use strict";
            var r = [],
                i, s, o, u = n || 1,
                a = !1;
            !isNaN(e) && !isNaN(t) ? (i = e, s = t) : isNaN(e) && isNaN(t) ? (a = !0, i = e.charCodeAt(0), s = t.charCodeAt(0)) : (i = isNaN(e) ? 0 : e, s = isNaN(t) ? 0 : t), o = i > s ? !1 : !0;
            if (o)
                while (i <= s) r.push(a ? String.fromCharCode(i) : i), i += u;
            else
                while (i >= s) r.push(a ? String.fromCharCode(i) : i), i -= u;
            return r
        }
    },
    stat = {
        timings: {
            tries: 0,
            triesMax: 120,
            errors: 0,
            errorsMax: 3
        },
        chartObj: {},
        init: function() {
            "use strict";
            $.browser.msie || this.drawChart(), this.bind(), this.getStatus(), $(".timer").stopwatch({
                format: "{MM}:{ss}"
            }).stopwatch("start")
        },
        getStatus: function() {
            "use strict";
            var e = globalData.apiUrl + "/search/" + statusData.hash + "/status?auth_token=" + globalData.user.token + global.dev(!0, "&"),
                t = this;
            $.ajax({
                type: "GET",
                url: e,
                dataType: "json",
                success: function(e) {
                    t.printStatus(e)
                },
                statusCode: {
                    500: function() {
                        t.errorInc("500")
                    },
                    404: function() {
                        t.errorInc("404")
                    },
                    401: function() {
                        t.errorInc("401")
                    },
                    400: function() {
                        t.errorInc("400")
                    }
                }
            })
        },
        errorInc: function(e) {
            "use strict";
            var t = this;
            this.timings.errors++, this.timings.errors < this.timings.errorsMax ? setTimeout(function() {
                t.getStatus()
            }, 500) : ($(".timer").stopwatch("stop"), global.loadError(e, "status")), typeof _kmq != "undefined" && _kmq.push(["record", "Status > Error > " + e])
        },
        printStatus: function(e, t) {
            "use strict";
            var n = this;
            if (e.data.message === "Searching finished.") n.finished(!1);
            else if (e.data.message === "Start/Loading search..." && e.data.result_count < 0) $(".total_results").addClass("small").find(".data").text("Running"), this.reload();
            else if (e.data.message === "Search not complete due to internal error.") this.finished(!0);
            else {
                $(".total_results .data").text(global.formatNumber(e.data.result_count));
                if (typeof n.chartObj != "undefined" || $.browser.msie) $.browser.msie || n.chartObj.append((new Date).getTime(), e.data.result_count), this.reload()
            }
            typeof t != "undefined" && t()
        },
        reload: function() {
            "use strict";
            var e = this,
                t = "/" + I18n.locale + "/search/";
            this.timings.tries++, this.timings.tries <= this.timings.triesMax ? setTimeout(function() {
                e.getStatus()
            }, 500) : confirm(I18n.t("status.confirm")) ? window.location.reload() : window.location = t
        },
        bind: function() {
            "use strict";
            $("#stop-search").click(function(e) {
                e.preventDefault();
                var t = globalData.apiUrl + "/search/" + statusData.hash + "/stop?auth_token=" + globalData.user.token + global.dev(!0, "&");
                confirm(I18n.t("status.sure")) && ($.ajax({
                    type: "PUT",
                    url: t,
                    dataType: "json",
                    success: function(e) {
                        alert(I18n.t("status.stopped"))
                    }
                }), window.location = "/" + I18n.locale + "/search/?child_of=" + statusData.hash + "&nc=true"), typeof _kmq != "undefined" && _kmq.push(["record", "Status page > User clicked stop"])
            })
        },
        finished: function(e) {
            "use strict";
            var t = this;
            $(".timer").stopwatch("stop"), e === !1 ? ($(".total_results").addClass("small").find(".data").text("Finished!"), !$.browser.msie && typeof status.data != "undefined" && t.chartObj.append((new Date).getTime(), status.data.result_count), $("#resultsChart").hide()) : $(".total_results").addClass("small").find(".data").text("Error"), window.location = "/" + I18n.locale + "/search/results/" + statusData.hash + "/?page=1", typeof _kmq != "undefined" && _kmq.push(["record", "Status page > Search finished"])
        },
        drawChart: function() {
            "use strict";
            var e = this,
                t = new SmoothieChart({
                    grid: {
                        strokeStyle: "rgb(204, 204, 204)",
                        fillStyle: "rgb(255, 255, 255)",
                        lineWidth: 1,
                        millisPerLine: 350,
                        verticalSections: 8
                    },
                    labels: {
                        fillStyle: "rgb(0, 0, 0)"
                    }
                });
            e.chartObj = new TimeSeries, t.addTimeSeries(e.chartObj, {
                strokeStyle: "rgb(152, 200, 2)",
                fillStyle: "rgba(152, 200, 2, 0.4)",
                lineWidth: 2
            }), t.streamTo(document.getElementById("resultsChart"), 1e3)
        }
    },
    user = {
        init: function(e) {
            "use strict";
            var t = this;
            t[e].init(t)
        },
        model: {
            get: function(e, t, n) {
                "use strict";
                var r = this,
                    i = r.authToken(),
                    s = globalData.apiUrl + e + "?auth_token=" + i + global.dev(!0, "&");
                $.ajax({
                    type: "GET",
                    url: s,
                    dataType: "json",
                    success: function(e) {
                        n(!0, e)
                    },
                    error: function(e) {
                        n(e.status, null)
                    }
                })
            },
            authToken: function() {
                "use strict";
                return globalData.user.token.length === 0 ? "" : globalData.user.token
            }
        },
        exports: {
            EXPORTS: {},
            EXPORT_DURATION: "24 hours",
            init: function(e) {
                "use strict";
                var t = this,
                    n = "";
                e.model.get("/export", e, function(n, r) {
                    $.extend(t.EXPORTS, r), t.view.init(n, t, e)
                })
            },
            view: {
                init: function(e, t, n) {
                    "use strict";
                    var r = this,
                        i = [];
                    e === !0 ? $.each(t.EXPORTS.data.exports, function(e) {
                        this.hash.length > 0 && i.push(r.renderExport.init(this, e, t, n))
                    }) : i.push(r.loadError(e)), $("#ind-export-container").html(i.join("")), $(".ind-export-wrapper").fadeIn(200), r.bind(), global.tooltip()
                },
                renderExport: {
                    init: function(e, t, n, r) {
                        "use strict";
                        var i = this,
                            s = [],
                            o = new Date,
                            u = moment.unix(parseFloat(e.start_time)),
                            a = moment.unix(parseFloat(e.end_time)),
                            f = moment(a).diff(u, "seconds"),
                            l = moment(a).day(o.getDay() + 1).fromNow(),
                            c = t >= 5 ? " closed" : "";
                        return s.push(i.exportHeader(u, e.hash)), s.push('<div class="ind-export-body clear">'), s.push(i.timeElapsed(f, e.status.message)), e.status.message === "completed" ? s.push(i.downloadButton(e, n, r, l)) : e.status.message === "queued" ? s.push(i.queuedMessage(e)) : s.push(i.progressBar(e)), s.push("</div>"), s.push(i.exportFooter(e)), i.wrap(s.join(""), t, e.hash)
                    },
                    wrap: function(e, t, n) {
                        "use strict";
                        return '<div class="ind-export-wrapper export-' + t + '" id="export-' + n.substring(0, 5) + '">' + e + "</div>"
                    },
                    exportHeader: function(e, t) {
                        "use strict";
                        var n = [];
                        return n.push('<div class="ind-export-header clear">'), n.push('<div class="started-at">Started @ ' + e.format("dddd, MMMM Do YYYY, h:mm:ss a") + "</div>"), n.push('<div class="export-mini-hash"><span class="tooltip-small" title="This is the exports unique identifier">' + t.substring(0, 5) + "</span></div>"), n.push("</div>"), n.join("")
                    },
                    timeElapsed: function(e, t) {
                        "use strict";
                        var n = new Date(null),
                            r = t === "completed" ? "to complete" : "elapsed";
                        return n.setSeconds(e), '<div class="time-elapsed"><span>Time ' + r + "</span>" + n.toTimeString().substr(0, 8) + "</div>"
                    },
                    downloadButton: function(e, t, n, r) {
                        "use strict";
                        var i = [];
                        return i.push('<div class="export-download-container clear">'), i.push('<div class="expire-at">This export will expire ' + r + "</div>"), i.push('<a href="' + globalData.remoteApiUrl + "/export/" + e.hash + "/download?auth_token=" + n.model.authToken() + '&csv" class="export-download button right green csv">Download CSV</a>'), i.push('<a href="' + globalData.remoteApiUrl + "/export/" + e.hash + "/download?auth_token=" + n.model.authToken() + '&xml" class="export-download button left green xml">Download XML</a>'), i.push("</div>"), i.join("")
                    },
                    queuedMessage: function() {
                        "use strict";
                        return '<div class="export-download-container queued clear"><p>Your export is queued. Please reload the page. This will eventually update automagically without reload.</p></div>'
                    },
                    progressBar: function() {
                        "use strict";
                        return '<div class="export-download-container clear">Export in progress, please reload the page to update this temporary message.</div>'
                    },
                    exportFooter: function(e) {
                        "use strict";
                        return '<div class="ind-export-footer">You\'re exporting ' + e.query.type + " for " + e.query.export_data.objects + "</div>"
                    }
                },
                loadError: function(e) {
                    "use strict";
                    return '<div class="load-error notice error">There was a problem retrieving your exports, please reload the page and try again. If the problem persists please contact support (Error: ' + e + ")</div>"
                },
                bind: function() {
                    "use strict";
                    $(".ind-export-header").click(function() {
                        $(this).siblings(".ind-export-body").slideToggle(250)
                    })
                }
            },
            controller: {
                statusCheck: function(e, t) {
                    "use strict";
                    var n = this;
                    setTimeout(function() {
                        t.model.get("/export", t, function(r, i) {
                            n.determineDifference(r, i, t, e)
                        })
                    }, 3e3)
                },
                determineDifference: function(e, t, n, r) {
                    "use strict";
                    return "foo"
                }
            }
        }
    };
