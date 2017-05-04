//= require_tree ./_vendor
//= require _kinto_helper
//= require _vendor_extra/kinto-http

/* globals KINTO_TOKEN */
window.localStorage.setItem('kintoToken', KINTO_TOKEN);
var kintoBucket = kintoBucket || window.getKintoBucket('http://kinto.voxmedia.com/v1','vox-aca-dashboard');
