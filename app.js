        const $ = document.querySelector.bind(document);
        const $$ = document.querySelectorAll.bind(document);

        const PLAYER_STORAGE_KEY = 'PLAYER';

        const cd = $('.cd')
        const heading = $('header h2')
        const cdThumb = $('.cd-thumb');
        const audio = $('#audio');        
        const playBtn = $('.btn-toggle-play')
        const player = $('.player');
        const progress = $('#progress');
        const nextBtn = $('.btn-next')
        const prevBtn = $('.btn-prev')
        const randomBtn = $('.btn-random')
        const repeatBtn = $('.btn-repeat')
        const playlist = $('.playlist')

        const app = {
        
            currentIndex: 0,
            isPlaying: false,
            isRandom: false,
            isRepeat: false,
            config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
            setConfig:function(key, value) {
                this.config[key] = value
                localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
            },
        songs: [
            {
            name: "Click Pow Get Down",
            singer: "Raftaar x Fortnite",
            path: "./assets/music/song_1.mp3",
            image: "./assets/img/song1.jpg"
            },
            {
            name: "shape of you",
            singer: "Ed Sheeran",
            path: "./assets/music/Ed Sheeran - shape of you.mp3",
            image: "./assets/img/Shape Of You.jpg"
            },
            {
            name: "Cheap Thrills",
            singer: "Sia",
            path: "./assets/music/Cheap Thrills - Sia.mp3",
            image: "./assets/img/Sia-Cheap-Thrills.jpg"
            },
            {
            name: "Alan Walker - The Spectre",
            singer: "Alan Walker",
            path: "./assets/music/Alan Walker - The Spectre.mp3",
            image: "./assets/img/The Spectre-Alan Walker.jpg"
            },
            {
            name: "Lạ Lùng",
            singer: "Vũ",
            path: "./assets/music/La Lung - Vu.mp3",
            image: "./assets/img/la_lung.jpg"
            },
            {
            name: "That Girl",
            singer: "Olly Murs",
            path: "./assets/music/That Girl.mp3",
            image: "./assets/img/That_Girl.jpg"
            },
            {
            name: "Salt",
            singer: "Ava Max",
            path: "./assets/music/Ava Max - Salt.mp3",
            image: "./assets/img/Ava Max - Salt.jpg"
            },
            
        ],
        
        render: function() {
            const htmls =this.songs.map((song, index) => {
                return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                    </div>
                `
            })
            playlist.innerHTML = htmls.join('') 
        },

        defineProperties: function() {
            Object.defineProperty(this, 'currentSong', {
                get: function() {
                    return this.songs[this.currentIndex];
                }
            })
        },

        handleEvents: function() {
            const cdWidth = cd.offsetWidth

            //su ly cd quyay /dung
            const cdThumbAnimate = cdThumb.animate([
                {transform: 'rotate(360deg)'}
            ],{
                duration: 10000, //10000 seconds
                iterations: Infinity
            })
            cdThumbAnimate.pause()

            // xử lý phóng to thu nhỏ cd
            document.onscroll = function() {

                const scrollTop = window.scrollY || document.documentElement.scrollTop

                const newCdWidth = cdWidth - scrollTop
                
                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
                cd.style.opacity = newCdWidth / cdWidth
            }
            //xử lý kho click play
            playBtn.onclick = function() {
                if(app.isPlaying) {
                    audio.pause()
                }else {
                    audio.play()
                }
            }
            //khi song dc play
            audio.onplay = function() {
                app.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
             //khi song bi pause
             audio.onpause = function() {
                app.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }
            // khi tien do song thay doi
            audio.ontimeupdate = function() {
               if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
               }
            }

            // xu khi tua song 
            progress.onchange = function(e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }
            // khi next song
            nextBtn.onclick = function() {
                if( app.isRandom) {
                    app.playRandomSong()
                } else {
                    app.nextSong()
                }
                audio.play()
                app.render()
                app.scrollToActiveSong()
            }
            // khi next prev
            prevBtn.onclick = function() {
                if( app.isRandom) {
                    app.playRandomSong()
                } else {
                    app.prevSong()
                }
                audio.play()
                app.render()
                app.scrollToActiveSong()
            }
            //xu ly bat / tat random 
            randomBtn.onclick = function(e) {
                app.isRandom = !app.isRandom
                app.setConfig('isRandom', app.isRandom)
                randomBtn.classList.toggle('active', app.isRandom)
            }
            //xử lý next song khi audio ended
            audio.onended = function() {
                if (app.isRepeat) {
                    audio.play()
                }else {
                    nextBtn.click()
                }
            }
            //xu ly lap lai 1 song
            repeatBtn.onclick = function() {
                app.isRepeat = !app.isRepeat
                app.setConfig('isRepeat', app.isRepeat)
                repeatBtn.classList.toggle('active', app.isRepeat)
            }
            // lang nghe click vao playlist
            playlist.onclick = function(e) {
                const songNode = e.target.closest('.song:not(.active)')

                if (songNode || e.target.closest('.option')) 
                {
                    // su ly khi click vaof song
                    if(songNode) {
                        app.currentIndex = Number(songNode.dataset.index)
                        app.loadCurrentSong()
                        app.render()
                        audio.play()
                    }
                }
            }
        },

        loadCurrentSong: function() {
            heading.textContent = this.currentSong.name
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
            audio.src = this.currentSong.path
        },

        scrollToActiveSong: function() {
            setTimeout(function() {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            }, 200)
        },

        loadConfig: function() {
            this.isRandom = this.config.isRandom
            this.isRepeat = this.config.isRepeat
           },

        nextSong: function() {
            this.currentIndex++
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
            this.loadCurrentSong()
        },

        prevSong: function() {
            this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
            this.loadCurrentSong()
        },

        playRandomSong: function() {
            let newIndex
            do{
                newIndex = Math.floor(Math.random() * this.songs.length)
            }while( newIndex === this.currentIndex)
            this.currentIndex = newIndex
            this.loadCurrentSong()
        },

        start: function() {
            // gán cấu hình từ config vào ướng dụng
            this.loadConfig()
            
            //định nghĩa các thuộc tính cho object
            this.defineProperties();
            
            // lắng nghe / xử lý các sự kiện (DOM events)
            this.handleEvents();

            // Tải thông tin bài hát đầu tiên vào UI khi chạy ướng dụng
            this.loadCurrentSong();

            //render playlist
            this.render();

            // hiển thị trang thái ban đầu cảu buttons repeat & random
            randomBtn.classList.toggle('active', app.isRandom)
            repeatBtn.classList.toggle('active', app.isRepeat)
        }
    }
    app.start()
