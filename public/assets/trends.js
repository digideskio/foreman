function trendTypeSelected(e){var t="FactName"==$(e).val(),i=$(e).attr("disabled");$("[id$='trend_trendable_id']").attr("disabled",t&&!i?null:"disabled")}$(function(){trendTypeSelected($("[id$='trend_trendable_type']"))});