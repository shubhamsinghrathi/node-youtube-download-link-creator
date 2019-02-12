const getScript = (url) => {
    return new Promise((resolve, reject) => {
        const http      = require('http'),
              https     = require('https');

        let client = http;

        if (url.toString().indexOf("https") === 0) {
            client = https;
        }

        client.get(url, (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                resolve(data);
            });

        }).on("error", (err) => {
            reject(err);
        });
    });
};

module.exports = youtubeDownloadLinkCreator = async(link) => {
    return new Promise((resolve, reject) => {
        try {
            if(!link) {
                return reject(new Error("Invalid URL was provided"));
            }
            let id = "";
            try {
                let elems = link.split("?")[1].split("&");
                for(let i=0; i<elems.length; i++) {
                    let query = elems[i].split("=");
                    if(query[0] == "v") {
                        id = query[1]
                        break;
                    }
                }
            } catch(er){}
            if(!id) return reject(new Error("Invalid URL was provided"));
            let url = `http://www.youtube.com/get_video_info?video_id=${id}&el=embedded&ps=default&eurl=&gl=US&hl=en`;
            getScript(url).then((data) => {
                let urlData = data;

                let x = urlData.split("&");
                let t = {}, g = [], h = {};

                if(urlData.search(/status=fail/i) != -1) {
                    return reject(new Error("Some error in the video format"));
                } else {
                    x.forEach(element => {
                        let c = element.split("=");
                        let n = c[0]; let v = c[1];
                        t[n] = v;
                        h[n] = decodeURIComponent(v);
                    });
                    let streams = decodeURIComponent(t['url_encoded_fmt_stream_map']).split(",");
                    streams.forEach(element => {
                        x = element.split("&");
                        x.forEach(elm => {
                            let c = elm.split("=");
                            let n = c[0]; v = c[1];
                            h[n] = decodeURIComponent(v);
                        })
                        g.push({
                            url: h["url"] || "",
                            quality: h["quality"] || "",
                            itag: h["itag"] || "",
                            type: h["type"] || "",
                            error: false
                        })
                    });
                    return resolve(g);
                }
            }).catch((err) => {
                reject(new Error("Some error on URL data fetch"));
            })
        } catch(err) {
            return reject(new Error("Some error occured"));
        }
    });
}