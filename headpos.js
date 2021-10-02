  /**
   * Fetch Inject module.
   *
   * @module fetchInject
   * @license Zlib
   * @param {(USVString[]|Request[])} inputs Resources you wish to fetch.
   * @param {Promise} [promise] A promise to await before attempting injection.
   * @throws {Promise<ReferenceError>} Rejects with error when given no arguments.
   * @throws {Promise<TypeError>} Rejects with error on invalid arguments.
   * @throws {Promise<Error>} Whatever `fetch` decides to throw.
   * @throws {SyntaxError} Via DOM upon attempting to parse unexpected tokens.
   * @returns {Promise<Object[]>} A promise which resolves to an `Array` of
   *     Objects containing `Response` `Body` properties used by the module.
   */
   injectHead = (function (i, n, j, e, c, t, s) { t = n.createElement(j), s = n.getElementsByTagName(j)[0]; t.appendChild(n.createTextNode(e.text)); t.onload = c(e); s ? s.parentNode.insertBefore(t, s) : n.head.appendChild(t) }); // eslint-disable-line
  fetchInject = function (inputs, promise) {
    if (!arguments.length) return Promise.reject(new ReferenceError("Failed to execute 'fetchInject': 1 argument required but only 0 present."))
    if (arguments[0] && arguments[0].constructor !== Array) return Promise.reject(new TypeError("Failed to execute 'fetchInject': argument 1 must be of type 'Array'."))
    if (arguments[1] && arguments[1].constructor !== Promise) return Promise.reject(new TypeError("Failed to execute 'fetchInject': argument 2 must be of type 'Promise'."))

    const resources = []
    const deferreds = promise ? [].concat(promise) : []
    const thenables = []

    inputs.forEach(input => deferreds.push(
      window.fetch(input).then(res => {
        return [res.clone().text(), res.blob()]
      }).then(promises => {
        return Promise.all(promises).then(resolved => {
          resources.push({ text: resolved[0], blob: resolved[1] })
        })
      })
    ))

    return Promise.all(deferreds).then(() => {
      resources.forEach(resource => {
        thenables.push({
          then: resolve => {
            resource.blob.type.includes('text/css')
              ? injectHead(window, document, 'style', resource, resolve)
              : injectHead(window, document, 'script', resource, resolve)
          }
        })
      })
      return Promise.all(thenables)
    })
  }





  var HeadPos = (function () {
    function InitHeadPos(onResult, HeadPosDIV = null, interval = 1000, minDetectionConfidence = 0.5, model = "short", selfieMode = false) {
      this.VerticalThreshold = -10;  //for repaint  of face points
      this.onResults = onResult;
      this.paused = false;
      this.interval = interval;// ms
      this.lastUpdateTime = 0;  //for storing time of last update


      // HeadPosDIV = document.getElementById('headpos')
      if (HeadPosDIV == null) {
        //if div is not given, attach it to the body
        HeadPosDIV = document.querySelector("html");
      }

      HeadPosDIV.innerHTML = `
  <div style="resize: both;overflow: hidden;     text-align: -webkit-center;">
    <video class="input_video" style="display: none;"></video>
    <canvas class="output_canvas" width="1280px" height="720px"
      style="height: -webkit-fill-available;    width: fit-content;"> </canvas>
  </div>  ` + HeadPosDIV.innerHTML;
      const videoElement = document.getElementsByClassName('input_video')[0];
      const canvasElement = document.getElementsByClassName('output_canvas')[0];
      const canvasCtx = canvasElement.getContext('2d');



      fetchInject([
        "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils@0.6/control_utils.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3/drawing_utils.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4/face_detection.js",
      ]).then(() => {
        //Get Camera
        const camera = new Camera(videoElement, {
          onFrame: async () => {
            if (((new Date().getTime()) - this.lastUpdateTime > this.interval) && !this.paused) {
              await faceDetection.send({ image: videoElement });
              this.lastUpdateTime = new Date().getTime();
            }
          },
          width: 1280,
          height: 720
        });

        camera.start();


        //Start Face detection
        const faceDetection = new FaceDetection({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4/${file}`;
          }
        });
        faceDetection.setOptions({
          minDetectionConfidence: minDetectionConfidence,
          model: model,
          selfieMode: selfieMode
        });


        faceDetection.onResults(paintResults);

      });



      //handle FaceDetection Outputs

      paintResults = function (results) {
        // Draw the overlays.
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
          results.image, 0, 0, canvasElement.width, canvasElement.height);
        if (results.detections.length > 0) {
          window.drawRectangle(
            canvasCtx, results.detections[0].boundingBox,
            { color: 'blue', lineWidth: 4, fillColor: '#00000000' });
          window.drawLandmarks(canvasCtx, results.detections[0].landmarks, {
            color: 'red',
            radius: 5,
          });
        }
        canvasCtx.restore();
        // Call the onResults callback.

        if (results.detections.length) {
          HeadPos.Init().calculateEyeDistance(results)
        }
      }


      //utils
      this.updateInterval = function (interval) {
        this.interval = interval;
        return this.interval
      }
      this.pause = function () {
        this.paused = true;
        return this.paused
      }
      this.resume = function (interval) {
        this.paused = false;
        return this.paused
      }

      this.calculateVerticalDistance = function (pose) {
        earr = 100 * pose.detections[0].landmarks[4].y; // right ear 
        nose = 100 * pose.detections[0].landmarks[2].y;

        difference = (earr - nose);
        DellVerticalThreshold = (this.VerticalThreshold - difference);

        this.VerticalThreshold = (this.VerticalThreshold - DellVerticalThreshold * 0.001);
        this.VerticalThreshold = clamp(this.VerticalThreshold, -20, 10);

        let dir = "";
        if (difference > 0) dir = "Up";
        else dir = "Down";
        // console.log(dir + " " + DellVerticalThreshold + " Th: " + this.VerticalThreshold + String((Math.abs(DellVerticalThreshold) > 30) ? "<b style='color: red'> Warn<b></b>" : ""));
        // $("#VerticalScore").html(dir + " " + Math.abs(DellVerticalThreshold.toFixed(2)) + " Th: " + VerticalThreshold.toFixed(2) + str((Math.abs(DellVerticalThreshold) > 30) ? " <b style='color: red'> Warn </b>" : ""));
        // debugger
        return [Math.abs(DellVerticalThreshold), dir];

      }

      this.calculateEyeDistance = function (pose) {
        //6 key points (right eye, left eye, nose tip, mouth center, right ear tragion, and left ear tragion).        eyel = pose.leftEye.x;
        pose.detections[0].landmarks[0]

        eyer = pose.detections[0].landmarks[0].x;
        eyel = pose.detections[0].landmarks[1].x;
        nose = pose.detections[0].landmarks[2].x;


        gapLength = eyer - eyel;
        towardsLeft = nose - eyel;
        towardsRight = eyer - nose;

        towardsLeftnorm = towardsLeft / gapLength;
        towardsRighttnorm = towardsRight / gapLength;

        ModulusDistance = Math.abs(towardsLeftnorm - 0.5) * 100;
        Towards = towardsLeftnorm > towardsRighttnorm ? "Right" : "Left";
        // debugger

        const [verticalMagnitude, verticalDir] = this.calculateVerticalDistance(pose);

        // HandleDistance();
        HeadPos.Init().onResults(
          {
            "HorizontalMagnitude": ModulusDistance,
            "HorizontalDirection": Towards,
            "VerticalMagnitude": verticalMagnitude,
            "VerticalDirection": verticalDir,
            "pose": pose,
          }
        );
      }



    }

    //check if HeadPos is already initialized; return old instance if initialized
    var instance;
    return {
      Init: function (onResult, HeadPosDIV, interval, minDetectionConfidence, model, selfieMode,) {
        if (instance == null) {
          instance = new InitHeadPos(onResult, HeadPosDIV, interval, minDetectionConfidence, model, selfieMode,);
          // Hide the constructor so the returned object can't be new'd...
          // instance.constructor = null;
        }
        else {
          // if(interval!== 'undefined') instance.interval = interval;// ms
        }
        return instance;
      }
    };
  })();
