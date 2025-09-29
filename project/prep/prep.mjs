var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { get_project_assets, asset_assignments, search_tag } from "/common/api.mts";
var field = function (i) { return "asset_definableFields_" + (i + 1); };
var definableFields = function (r) { return (Object.fromEntries(r.assetTypes_definableFields_ARRAY
    .map(function (v, i) {
    if (v == 'Fuse (A)')
        return [v, ""];
    else
        return [v, r[field(i)]];
}))); };
var dedup_types = function (requested) {
    var types = {};
    var _loop_1 = function (r) {
        var permissive_r = r;
        if (!Object.hasOwn(types, r.assetTypes_id)) {
            types[r.assetTypes_id] = {
                id: r.assetTypes_id,
                name: r.assetTypes_name,
                assets: [r],
                definableFields: definableFields(r)
            };
        }
        else if (Object.entries(types[r.assetTypes_id].definableFields).every(function (_a, i) {
            var k = _a[0], v = _a[1];
            return v == permissive_r[field(i)];
        })) {
            types[r.assetTypes_id].assets.push(r);
        }
        else {
            types[r.assetTypes_id] = {
                id: r.assetTypes_id,
                name: r.assetTypes_name,
                assets: [r],
                definableFields: definableFields(r)
            };
        }
    };
    for (var _i = 0, requested_1 = requested; _i < requested_1.length; _i++) {
        var r = requested_1[_i];
        _loop_1(r);
    }
    return Object.values(types);
};
var tag = document.getElementById('prep_tag');
var requested = [];
var tag_handle = function () { return __awaiter(void 0, void 0, void 0, function () {
    var asset;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, search_tag(tag.value)];
            case 1:
                asset = _a.sent();
                requested.find(function (v) { return v.id == asset.assetTypes_id && Object.is(v.definableFields, definableFields(asset)); });
                return [2 /*return*/];
        }
    });
}); };
export function start_prep(project_id) {
    return __awaiter(this, void 0, void 0, function () {
        var assets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get_project_assets(project_id)];
                case 1:
                    assets = (_a.sent())[import.meta.env.INSTANCE];
                    requested = dedup_types(assets[asset_assignments.requested].assets);
                    return [2 /*return*/];
            }
        });
    });
}
