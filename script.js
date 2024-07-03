let currentPage = 1
let lastPage = 1
// infinti scroll //
window.addEventListener("scroll", function(){
    let endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if(endOfPage && currentPage < lastPage){
        currentPage = currentPage + 1
        getPosts(false, currentPage)
    }
})
// end infinti scroll //

function getPosts(reload = true, page = 1){
    loader(true)
    axios.get(`${basUrl}/posts?limit=5&page=${page}`)
.then(function(response){
    let posts = response.data.data
    lastPage = response.data.meta.last_page

    if (reload){
        document.getElementById("posts").innerHTML = ""
    }
    for(let post of posts)
    {
        let author = post.author
        let postTitle = ""
        /// show or hide (edit) button
        let user = getCurrentUser()
        let isMyPost = user != null && post.author.id == user.id
        let editButtonContent = ``
        if(isMyPost){
            editButtonContent = `
            <div>
                <button class="ml-2 bg-danger rounded-2" id="delet-post-click" onclick="deletPostClicked('${encodeURIComponent(JSON.stringify(post))}')" style="outline: none; border: none;">
                Delet</button>
                <button clss="rounded-2" id="edit-post-click" onclick="editPostClicked('${encodeURIComponent(JSON.stringify(post))}')" style="outline: none; border: none;">
                Edit </button>
            </div>`
        }
        if(post.title != null){
            postTitle = post.title  
        }
        let content = `
        <div class="card shadow" style="cursor: pointer;" >
                        <div class="card-header" style = "display: flex; justify-content: space-between; align-items: center;">
                        <div class="info" onClick="clickedUser(${author.id})">
                          <img src="${author.profile_image}" alt="" style="width: 40px; height: 40px;" class="rounded-circle border border-1">
                            <span id="title">
                                ${author.username}
                            </span>
                        </div>
                        ${editButtonContent}
                        </div>
                        <div class="card-body">
                          <img src="${post.image}" alt="" class="w-100">
                          <h6 style="color: gray;" class="mt-1">${post.created_at}</h6>
                          <h4>${postTitle}</h4>
                          <p>${post.body}</p>
                            <hr>
                            <div class="d-flex justify-content-around">
                                <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                </svg>
                                <span>Like</span>
                                </div>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                    </svg>
                                    <span onclick="postClicked(${post.id})">(${post.comments_count}) comments</span>
                                    <span id="post-tags${post.id}">
                                    </span>
                                </div>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                                        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
                                    </svg>
                                    <span>Share</span>
                                </div>
                            </div>
                        </div>
                    </div>
        `
        document.getElementById("posts").innerHTML += content;
        let postTagsId = `post-tags${post.id}`
      document.getElementById(postTagsId).innerHTML = ""
      for(tag of post.tags){
        let tagContent = 
        `
            <button class="btn btn-secondary rounded-5" style="background-color: gray; color: white;">
                    ${tag.name}
            </button>
       `
        document.getElementById(postTagsId).innerHTML += tagContent
      }
    }
})
.catch(function(error){
    console.log(error);
})
.finally(()=>{
    loader(false)
})
}
getPosts()




function addPost(){
    document.getElementById("post-id").value = ''
     document.getElementById("add-post-title").innerHTML = "Add A New Post"
     document.getElementById("upDate-btn").innerHTML = "Create"
     document.getElementById("body-post-input").value = ''
    document.getElementById("title-post-input").value = ''
    let postModal = new bootstrap.Modal(document.getElementById("add-post-modal"))
    postModal.toggle()
}




