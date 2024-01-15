/**
 * !info {Module} -来自PGAoT-VAS
 */

/**
 * @class 
 * @classdesc SHA1加密校检
 * @desc SHA1哈希函数通常用于密码学和数据完整性验证。
 */
class SHA1Tool {
    /**
     * @method 
     * @param {string} s 加密后的字符串
     * @param {string} t 原字符串
     * @return {boolean} 匹配结果
     * @desc 判断加密字符串与原字符串是否匹配。
     */
    static isMatching(s, t) {
        return s == this.sha1(t) ? true : false
    }

    /**
     * @method 
     * @param {string} arg 不定参，传入格式例如："box=fishcool","game=fish666"
     * @return {string} JSON格式的字符串
     * @desc 普通字符转JSON格式的字符串
     */
    static toJSON(...arg) {
        let jsonText = '{'
        let spText = ''
        arg.forEach((item) => {
            spText = item.split("=")
            jsonText += '"' + spText[0] + '":"' + spText[1] + '",'
        })
        jsonText = jsonText.substr(0, jsonText.length - 1);
        jsonText += '}'
        return jsonText
    }

    /**
     * @method 
     * @param {string} arg 不定参，传入格式例如："box=fishcool","game=fish666"
     * @return {string} JSON格式的字符串
     * @desc 普通字符转Url格式的字符串
     */
    static toUrl(...arg) {
        let urlText = ''
        let spText = ''
        arg.forEach((item) => {
            spText = item.split("=")
            urlText += '&' + spText[0] + '=' + spText[1] + ''
        })
        urlText = urlText.substr(1);
        return urlText
    }

    /**
     * @method 
     * @param {string} s 原字符串
     * @return {string} 加密后的字符串
     * @desc SHA1加密
     */
    static sha1(s) {
        var i, r = [], c, x;
        for (i = 0; i < s.length; i++)
            if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
            else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
            else {
                if ((x = c ^ 0xD800) >> 10 == 0)
                    c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
                        r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
                else r.push(0xE0 + (c >> 12 & 0xF));
                r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
            };
        var data = new Uint8Array(r)
        var i, j, t;
        var l = ((data.length + 8) >>> 6 << 4) + 16, s = new Uint8Array(l << 2);
        s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
        for (t = new DataView(s.buffer), i = 0; i < l; i++)s[i] = t.getUint32(i << 2);
        s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
        s[l - 1] = data.length << 3;
        var w = [], f = [
            function () { return m[1] & m[2] | ~m[1] & m[3]; },
            function () { return m[1] ^ m[2] ^ m[3]; },
            function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]; },
            function () { return m[1] ^ m[2] ^ m[3]; }
        ], rol = function (n, c) { return n << c | n >>> (32 - c); },
            k = [1518500249, 1859775393, -1894007588, -899497514],
            m = [1732584193, -271733879, null, null, -1009589776];
        m[2] = ~m[0], m[3] = ~m[1];
        for (i = 0; i < s.length; i += 16) {
            var o = m.slice(0);
            for (j = 0; j < 80; j++)
                w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
                    t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
                    m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
            for (j = 0; j < 5; j++)m[j] = m[j] + o[j] | 0;
        };
        t = new DataView(new Uint32Array(m).buffer);
        for (var i = 0; i < 5; i++)m[i] = t.getUint32(i << 2);
        var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
            return (e < 16 ? "0" : "") + e.toString(16);
        }).join("");
        return hex;
    }
}
module.exports = { SHA1Tool }