(() => {
    function e(e, t) {
        var i = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
        if (!i) {
            if (Array.isArray(e) || (i = function(e, t) {
                    if (!e) return;
                    if ("string" == typeof e) return n(e, t);
                    var i = Object.prototype.toString.call(e).slice(8, -1);
                    "Object" === i && e.constructor && (i = e.constructor.name);
                    if ("Map" === i || "Set" === i) return Array.from(e);
                    if ("Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)) return n(e, t)
                }(e)) || t && e && "number" == typeof e.length) {
                i && (e = i);
                var r = 0,
                    o = function() {};
                return {
                    s: o,
                    n: function() {
                        return r >= e.length ? {
                            done: !0
                        } : {
                            done: !1,
                            value: e[r++]
                        }
                    },
                    e: function(e) {
                        throw e
                    },
                    f: o
                }
            }
            throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }
        var a, u = !0,
            m = !1;
        return {
            s: function() {
                i = i.call(e)
            },
            n: function() {
                var e = i.next();
                return u = e.done, e
            },
            e: function(e) {
                m = !0, a = e
            },
            f: function() {
                try {
                    u || null == i.return || i.return()
                } finally {
                    if (m) throw a
                }
            }
        }
    }

    function n(e, n) {
        (null == n || n > e.length) && (n = e.length);
        for (var t = 0, i = new Array(n); t < n; t++) i[t] = e[t];
        return i
    }
    window.GiveDonationSummary = {
        init: function() {
            GiveDonationSummary.initAmount(), GiveDonationSummary.initFrequency(), GiveDonationSummary.initTotal()
        },
        getFormattedDonationAmount: function(e) {
            var n = Give.fn.unFormatCurrency(e.find('[name="give-amount"]').val(), Give.form.fn.getInfo("decimal_separator", e));
            return Give.fn.formatCurrency(n, {
                symbol: Give.form.fn.getInfo("currency_symbol", e)
            }, e)
        },
        initAmount: function() {
            GiveDonationSummary.observe('[name="give-amount"]', (function(e, n) {
                n.find('[data-tag="amount"]').html(GiveDonationSummary.getFormattedDonationAmount(n))
            }))
        },
        initFrequency: function() {
            GiveDonationSummary.observe('[name="give-recurring-period"]', GiveDonationSummary.handleDonorsChoiceRecurringFrequency), GiveDonationSummary.observe('[name="give-price-id"]', GiveDonationSummary.handleAdminDefinedRecurringFrequency), GiveDonationSummary.observe('[name="_give_is_donation_recurring"]', GiveDonationSummary.handleAdminDefinedSetDonationFrequency), GiveDonationSummary.observe('[name="give-price-id"]', GiveDonationSummary.handleAdminDefinedRecurringFrequency)
        },
        handleDonorsChoiceRecurringFrequency: function(e, n) {
            n.find(".js-give-donation-summary-frequency-help-text").toggle(!e.checked), n.find('[data-tag="frequency"]').toggle(!e.checked), n.find('[data-tag="recurring"]').toggle(e.checked).html(e.dataset.periodLabel);
            var t = document.querySelector('[name="give-recurring-period-donors-choice"]');
            if (t) {
                var i = t.options[t.selectedIndex].value || !1;
                i && n.find('[data-tag="recurring"]').html(GiveDonationSummaryData.recurringLabelLookup[i])
            }
        },
        handleAdminDefinedRecurringFrequency: function(e, n) {
            var t = e.value,
                i = document.querySelector(".give_recurring_donation_details");
            if (i) {
                var r = JSON.parse(i.value);
                if (void 0 !== r.multi) {
                    var o = "yes" === r.multi[t]._give_recurring,
                        a = r.multi[t].give_recurring_pretty_text;
                    n.find(".js-give-donation-summary-frequency-help-text").toggle(!o), n.find('[data-tag="frequency"]').toggle(!o), n.find('[data-tag="recurring"]').toggle(o).html(a)
                }
            }
        },
        handleAdminDefinedSetDonationFrequency: function(e, n) {
            var t = e.value,
                i = document.querySelector(".give-recurring-admin-choice");
            t && i && (n.find(".js-give-donation-summary-frequency-help-text").toggle(!t), n.find('[data-tag="frequency"]').toggle(!t), n.find('[data-tag="recurring"]').html(i.textContent))
        },
        handleFees: function(e) {
            if (e.find('[name="give-fee-mode-enable"]') && "true" === e.find('[name="give-fee-mode-enable"]').val()) {
                e.find(".js-give-donation-summary-fees").toggle(!0);
                var n = e.find(".give-fee-message-label").attr("data-feemessage").split(" "),
                    t = e.find(".give-fee-message-label-text").text().split(" ").filter((function(e) {
                        return !n.includes(e)
                    })).pop();
                e.find('[data-tag="fees"]').html(t)
            } else e.find(".js-give-donation-summary-fees").toggle(!1)
        },
        initTotal: function() {
            GiveDonationSummary.observe(".give-final-total-amount", (function(e, n) {
                n.find('[data-tag="total"]').html(e.textContent), GiveDonationSummary.handleFees(n)
            }));
            var e = document.querySelector(".give-final-total-amount");
            e && (e.textContent = e.textContent)
        },
        handleNavigateBack: function() {},
        onGatewayLoadSuccess: function() {
            var e = jQuery("#give_purchase_form_wrap .give-donation-summary-section").detach();
            e.length && (jQuery(".give-donation-summary-section").remove(), e.appendTo("#donate-fieldset"), GiveDonationSummary.initTotal(), GiveDonationSummary.handleNavigateBack = function(e) {
                e.stopPropagation(), e.preventDefault(), window.formNavigator.back()
            })
        },
        observe: function(n, t) {
            var i = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
                r = document.querySelector(n);
            if (r) {
                var o = jQuery(r.closest(".give-form"));
                new MutationObserver((function(n) {
                    var i, r = e(n);
                    try {
                        for (r.s(); !(i = r.n()).done;) {
                            var a = i.value;
                            "attributes" === a.type && t(a.target, o)
                        }
                    } catch (e) {
                        r.e(e)
                    } finally {
                        r.f()
                    }
                })).observe(r, {
                    attributes: !0
                }), i && t(r, o)
            }
        }
    }, jQuery(document).on("give:postInit", GiveDonationSummary.init), jQuery(document).on("Give:onGatewayLoadSuccess", GiveDonationSummary.onGatewayLoadSuccess)
})();