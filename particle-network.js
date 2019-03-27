// Martins Super Amazing Optimized Particle Network

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
(function(factory) {

    // Establish the root object, `window` in the browser, or `global` on the server.
    var root = (typeof self === 'object' && self.self === self && self) || (typeof global === 'object' && global.global === global && global);

    // AMD.
    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            root.ParticleNetworkOptimized = factory(root, exports);
        });
    }

    // Node.js or CommonJS.
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory(root, {});
    }

    // Browser global.
    else {
        root.ParticleNetworkOptimized = factory(root, {});
    }

}(function(root, ParticleNetworkOptimized) {
    // Create Particle class
    var Particle = function(parent) {
        this.canvas = parent.canvas;
        this.ctx = parent.ctx;
        this.particleColor = parent.options.particleColor;
        if(parent.options.refreshRateLimit){
           this.refreshRateLimit = parent.options.refreshRateLimit;
         }else{
            this.refreshRateLimit = 2;
         }
        // refreshRateLimit added for optimization
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        window.scaler = 1;
        if (parent.options.density == 4500) {
            window.scaler = 0.6;
        };
        this.sizer = getRandomArbitrary(1 * window.scaler, 3 * window.scaler);
        this.velocity = {
            x: (((Math.random() - 0.5) / 2) * ((parent.options.velocity / 3) + (this.sizer / 5))) * window.scaler,
            y: (((Math.random() - 0.5) / 2) * ((parent.options.velocity / 3) + (this.sizer / 5))) * window.scaler
        };
    };
    Particle.prototype.update = function() {

        // Change dir if outside map
        if (this.x > this.canvas.width + 20 || this.x < -20) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y > this.canvas.height + 20 || this.y < -20) {
            this.velocity.y = -this.velocity.y;
        }

        // Update position
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };
    //Particle.prototype.id = 0;
    Particle.prototype.draw = function() {

        // Draw particle
        this.ctx.beginPath();
        this.ctx.fillStyle = "#fff";
        this.ctx.globalAlpha = 0.3;
        this.ctx.scaleParticle = window.devicePixelRatio;
        if (this.ctx.scaleParticle > 1) {
            this.ctx.scaleParticle = window.devicePixelRatio * 4;
        };
        //console.log(this.ctx.scaleParticle);
        this.ctx.arc(this.x, this.y, this.sizer * window.scaler, 0, (2 * this.ctx.scaleParticle) * Math.PI);
        this.ctx.fill();
        //fadeIn(this.prototype.id);
        //this.prototype.id +=1;
    };

    function fadeIn(ParticleFade) {
        //Particle.prototype.ParticleFade.fadeIn("slow");
    };

    // Create ParticleNetworkOptimized class
    ParticleNetworkOptimized = function(canvas, options) {

        this.canvasDiv = canvas;
        this.canvasDiv.size = {
            'width': this.canvasDiv.offsetWidth,
            'height': this.canvasDiv.offsetHeight
        };

        // Set options
        options = options !== undefined ? options : {};
        this.options = {
            particleColor: (options.particleColor !== undefined) ? options.particleColor : '#fff',
            background: (options.background !== undefined) ? options.background : '#8aff00',
            interactive: (options.interactive !== undefined) ? options.interactive : true,
            velocity: this.setVelocity(options.speed),
            density: this.setDensity(options.density)
        };

        this.init();
    };
    ParticleNetworkOptimized.prototype.init = function() {

        // Create background div
        this.bgDiv = document.createElement('div');
        this.canvasDiv.appendChild(this.bgDiv);
        this.setStyles(this.bgDiv, {
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'bottom': 0,
            'right': 0,
            'z-index': 1
        });

        // Check if valid background hex color
        if ((/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i).test(this.options.background)) {
            this.setStyles(this.bgDiv, {
                'background': "transparent"
            });
        }
        // Else check if valid image
        else if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(this.options.background)) {
            this.setStyles(this.bgDiv, {
                'background': 'url("' + this.options.background + '") no-repeat center',
                'background-size': 'cover'
            });
        }
        // Else throw error
        else {
            console.error('Please specify a valid background image or hexadecimal color');
            return false;
        }

        // Check if valid particleColor
        if (!(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i).test(this.options.particleColor)) {
            console.error('Please specify a valid particleColor hexadecimal color');
            return false;
        }

        // Create canvas & context
        this.canvas = document.createElement('canvas');
        this.canvasDiv.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = this.canvasDiv.size.height;
        this.setStyles(this.canvasDiv, { 'position': this.options.position });
        this.setStyles(this.canvas, {
            'z-index': '101',
            'position': 'relative'
        });

        var dpr = window.devicePixelRatio;
        this.ctx.scale(dpr, dpr);
        // Add resize listener to canvas
        window.addEventListener('resize', function() {

            // Check if div has changed size
            if (this.canvasDiv.offsetWidth === this.canvasDiv.size.width) {
                return false;
            }
            //console.log("offset:"+this.canvasDiv.offsetWidth+" | Window:"+jQuery(window).width()+" | Size:"+this.canvasDiv.size.width);
            // Scale canvas
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = window.innerWidth = window.innerWidth;
            this.canvas.height = this.canvasDiv.size.height = this.canvasDiv.offsetHeight;
            var dpr = window.devicePixelRatio;
            this.ctx.scale(dpr, dpr);
            // Set timeout to wait until end of resize event
            clearTimeout(this.resetTimer);
            this.resetTimer = setTimeout(function() {

                // Reset particles
                this.particles = [];
                for (var i = 0; i < (this.canvas.width * this.canvas.height / this.options.density); i++) {
                    this.particles.push(new Particle(this));
                }
                if (this.options.interactive) {
                    this.particles.push(this.mouseParticle);
                }

                // Update canvas
                requestAnimationFrame(this.update.bind(this));

            }.bind(this), 500);

        }.bind(this));

        // Initialise particles
        this.particles = [];
        var countParticle = 0;
        for (var i = 0; i < (this.canvas.width * this.canvas.height / this.options.density); i++) {
            this.particles.push(new Particle(this));
            countParticle++;
        }
        //console.log(countParticle);

        if (this.options.interactive) {
            // Add mouse particle if interactive
            this.mouseParticle = new Particle(this);
            this.mouseParticle.velocity = {
                x: 0,
                y: 0
            };
            this.particles.push(this.mouseParticle);

            // Mouse event listeners
            this.canvas.addEventListener('mousemove', function(e) {
                if (window.scaler == 1) {
                    var rect = this.canvas.getBoundingClientRect();
                    this.mouseParticle.x = (e.clientX - rect.left) / window.devicePixelRatio;
                    this.mouseParticle.y = (e.clientY - rect.top) / window.devicePixelRatio;
                };
            }.bind(this));

            this.canvas.addEventListener('mouseup', function(e) {
                this.mouseParticle.velocity = {
                    x: (((Math.random() - 0.5) * this.options.velocity) * window.scaler) / (window.devicePixelRatio * 2),
                    y: (((Math.random() - 0.5) * this.options.velocity) * window.scaler) / (window.devicePixelRatio * 2)
                };
                //console.log(window.scaler);

                this.mouseParticle = new Particle(this);
                if (window.scaler == 1) {
                    this.mouseParticle.velocity = {
                        x: 0,
                        y: 0
                    };
                };
                this.particles.push(this.mouseParticle);
                var rect = this.canvas.getBoundingClientRect();
                this.mouseParticle.x = (e.clientX - rect.left) / window.devicePixelRatio;
                this.mouseParticle.y = (e.clientY - rect.top) / window.devicePixelRatio;

            }.bind(this));

        };

        // Update canvas
        requestAnimationFrame(this.update.bind(this));
    }
    var slow_update = 0;
    this.opacityEase = 0.5;
    this.fadeSwitch = true;
    ParticleNetworkOptimized.prototype.update = function() {
        if (slow_update == this.refreshRateLimit) { // Slow update refresh rate
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalAlpha = 1;

            // Draw particles

            for (var i = 0; i < this.particles.length; i++) {

                this.particles[i].update();
                this.particles[i].draw();

                // Draw connections
                for (var j = this.particles.length - 1; j > i; j--) {
                    var distance = Math.sqrt(
                        (Math.pow(this.particles[i].x - this.particles[j].x, 2)) / window.scaler +
                        (Math.pow(this.particles[i].y - this.particles[j].y, 2)) / window.scaler
                    );
                    if (distance > 150) {
                        continue;
                    }

                    this.ctx.beginPath();
                    var newcolor = "#8aff00";
                    this.ctx.strokeStyle = "#8aff00";
                    this.ctx.globalAlpha = ((150 - distance) / 150); //*parent.opacityEase;
                    this.ctx.lineWidth = 0.7 * window.scaler;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }

            }

            // Draw particles - Martin Kaiser edits
            if (window.scaler == 1) {
                for (var i = 0; i < 1; i++) {
                    this.mouseParticle.update();
                    this.mouseParticle.draw();

                    // Draw connections
                    for (var j = this.particles.length - 1; j > i; j--) {
                        var distance = Math.sqrt(
                            (Math.pow(this.mouseParticle.x - this.particles[j].x, 2)) / window.scaler +
                            (Math.pow(this.mouseParticle.y - this.particles[j].y, 2)) / window.scaler
                        );
                        if (distance > 120) {
                            continue;
                        }
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = "#fff";
                        this.ctx.globalAlpha = ((120 - distance) / 120); //*parent.opacityEase;
                        this.ctx.lineWidth = 1 * window.scaler;
                        this.ctx.moveTo(this.mouseParticle.x, this.mouseParticle.y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();

                        for (var f = this.particles.length - 1; f > j; f--) {
                            var distance = Math.sqrt(
                                (Math.pow(this.particles[j].x - this.particles[f].x, 2)) / window.scaler +
                                (Math.pow(this.particles[j].y - this.particles[f].y, 2)) / window.scaler
                            );
                            if (distance > 120) {
                                continue;
                            }
                            this.ctx.beginPath();
                            this.ctx.strokeStyle = "#fff";
                            this.ctx.globalAlpha = ((120 - distance) / 120); //*parent.opacityEase;
                            this.ctx.lineWidth = 1 * window.scaler;
                            this.ctx.moveTo(this.particles[j].x, this.particles[j].y);
                            this.ctx.lineTo(this.particles[f].x, this.particles[f].y);
                            this.ctx.stroke();

                            for (var g = this.particles.length - 1; g > f; g--) {
                                var distance = Math.sqrt(
                                    (Math.pow(this.particles[f].x - this.particles[g].x, 2)) / window.scaler +
                                    (Math.pow(this.particles[f].y - this.particles[g].y, 2)) / window.scaler
                                );
                                if (distance > 120) {
                                    continue;
                                }
                                this.ctx.beginPath();
                                this.ctx.strokeStyle = "#fff";
                                this.ctx.globalAlpha = ((120 - distance) / 120); //*parent.opacityEase;
                                this.ctx.lineWidth = 1 * window.scaler;
                                this.ctx.moveTo(this.particles[f].x, this.particles[f].y);
                                this.ctx.lineTo(this.particles[g].x, this.particles[g].y);
                                this.ctx.stroke();
                            }
                        }
                    }
                }
            };

            slow_update = 0;
            requestAnimationFrame(this.update.bind(this));
        } else {
            slow_update++;
            requestAnimationFrame(this.update.bind(this));
        };
        if (parent.opacityEase !== 0 & parent.fadeSwitch == true) {
            parent.opacityEase -= 0.005;
        } else {
            parent.fadeSwitch = false;
        };
        if (parent.opacityEase !== 0.5 & parent.fadeSwitch == false) {
            parent.opacityEase += 0.005;
        } else {
            parent.fadeSwitch = true;
        };
    };

    // Helper method to set velocity multiplier
    ParticleNetworkOptimized.prototype.setVelocity = function(speed) {
        if (speed === 'fast') {
            return 2;
        } else if (speed === 'slow') {
            return 0.2;
        } else if (speed === 'none') {
            return 0;
        }
        return 0.2;
    }
    // Helper method to set density multiplier
    ParticleNetworkOptimized.prototype.setDensity = function(density) {
        if (density === 'high') {
            return 6000;
        } else if (density === 'low') {
            return 13500;
        } else if (density === 'mobile') {
            return 4500;
        }
        return !isNaN(parseInt(density, 10)) ? density : 12000;
    }
    // Helper method to set multiple styles
    ParticleNetworkOptimized.prototype.setStyles = function(div, styles) {
        for (var property in styles) {
            div.style[property] = styles[property];
        }
    }

    return ParticleNetworkOptimized;

}));
