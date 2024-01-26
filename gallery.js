console.log("hello from gallery");
setTimeout(() => {
    if (db) {
        // video retrival
        let videodbTransaction = db.transaction("video", "readonly");
        let videoStore = videodbTransaction.objectStore("video");
        let videoRequest = videoStore.getAll(); // event driven
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let gallerycont = document.querySelector(".gallery-cont");
            videoResult.forEach((videoobj) => {
                let mediaEle = document.createElement("div");
                mediaEle.setAttribute("class", "media-cont");
                mediaEle.setAttribute("id", videoobj.id);
                let url = URL.createObjectURL(videoobj.blobData);
                mediaEle.innerHTML = `
                <div class="media">
                <video autoplay loop src="${url}"></video>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
             `;
                gallerycont.appendChild(mediaEle);

                //listeners
                let deletebtn = mediaEle.querySelector(".delete");
                deletebtn.addEventListener("click", deleteListener)
                let downloadbtn = mediaEle.querySelector(".download");
                downloadbtn.addEventListener("click", downloadListener);


            });
        }

        // image retrival
        let imagedbTransaction = db.transaction("image", "readonly");
        let imageStore = imagedbTransaction.objectStore("image");
        let imageRequest = imageStore.getAll(); // event driven
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let gallerycont = document.querySelector(".gallery-cont");
            imageResult.forEach((imageobj) => {
                let mediaEle = document.createElement("div");
                mediaEle.setAttribute("class", "media-cont");
                mediaEle.setAttribute("id", imageobj.id);
                let url = imageobj.URL;
                mediaEle.innerHTML = `
                <div class="media">
                <img src="${url}" />
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
             `;
                gallerycont.appendChild(mediaEle);

                // listeners
                let deletebtn = mediaEle.querySelector(".delete");
                deletebtn.addEventListener("click", deleteListener)
                let downloadbtn = mediaEle.querySelector(".download");
                downloadbtn.addEventListener("click", downloadListener);

            });
        }
    }
}, 100);

// ui removal, DB remove
function deleteListener(e) {
    // DB removal
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        let videodbTransaction = db.transaction("video", "readwrite");
        let videoStore = videodbTransaction.objectStore("video");
        videoStore.delete(id);
    } else if (type === "img") {
        let imagedbTransaction = db.transaction("image", "readwrite");
        let imageStore = imagedbTransaction.objectStore("image");
        imageStore.delete(id);
    }

    // ui removal
    e.target.parentElement.remove();

}
function downloadListener(e) {
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        let videodbTransaction = db.transaction("video", "readwrite");
        let videoStore = videodbTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let videoURL = URL.createObjectURL(videoResult.blobData);

            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();

        }

    } else if (type === "img") {
        let imagedbTransaction = db.transaction("image", "readwrite");
        let imageStore = imagedbTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

            let a = document.createElement("a");
            a.href = imageResult.URL;
            a.download = "image.jpg";
            a.click();

        }
    }

}
