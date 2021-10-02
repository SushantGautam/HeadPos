This simplified library gives position (up/down/lest/right) of 🙂 head/face including its magnitude/degree with the :six: faical keypoints (x,y). This is backed by MediaPipe. The whole library and its dependencies are just in KBs. The memory footprint is very low on realtime environment and can run on very low resources. There are options to 🎛️ control the time between inferences which reduces unnecessary computations. 

# 🚀 Demo
Check the [live demo](https://sushantgautam.github.io/HeadPos/demo.html "live demo").

# 📉 Usage

Just include this JS dependency. Doesn't need JQuery.

```html
<script src="https://cdn.jsdelivr.net/gh/SushantGautam/HeadPos/headpos.js"></script>
```


```html
<script>

  // define a callback to handle the results
  OnResults = function (rs) {console.log(rs)}
  
 // initlialize HeadPos. Other optional congifs can also be added as required.
  let headpos = HeadPos.Init(OnResults);
    
</script>
```

# 📊 Results
![image](https://user-images.githubusercontent.com/16721983/135709814-4f134c07-9ba5-4e02-abe4-47d6894819b5.png)

Callback will get a dictionary with:
```javascript
{
HorizontalDirection: "Right"
HorizontalMagnitude: 0.9363492190335054
VerticalDirection: "Down"
VerticalMagnitude: 1.3243558415961285,
pose: {"..."}
}
```
**pose** contains a dict with 6 key points (x,y) of right eye, left eye, nose tip, mouth center, right ear tragion, and left ear tragion and a reference to the canvas.


# 🎈 Methods
1. **InitHeadPos** 
Initialize the instance. This library has a singleton implementation.

```javascript
let headpos = HeadPos.Init(
    HeadPosOnResults,  //callback on log value
    HeadPosDIV = document.getElementById('headpos'), // div to render headpos
    interval = 100, // time in ms to wait between callbacks, 0 is as fast as possible
	minDetectionConfidence =0.5, //Face Recognition threshold 
	 model = "short",  //  short-range model that works best for faces within 2 meters from the camera 
	 selfieMode = false,  //invert the camera 
	); 

```
You can define a div/p element as:
```html
<div id='headpos'></div>
```
and pass the element to **HeadPosDIV**. The HeadPos output canvas will be prepended inside the given element. If nothing is passed, the canvas will be appended to the root of HTML.

2. **updateInterval**
Dynamically udate time in ms to wait between callbacks.

```javascript
headpos.updateInterval(1000) 
```

3. **pause**
Pause the inference. Canvas rendering will also pause.

```javascript
headpos.pause() 
```

4. **resume**
Resume the inference after pause. Canvas rendering will also resume.

```javascript
headpos.resume() 
```

# 🙋 Improving
PRs,issues, ideas or suggestions are highly welcome. 👌

# 🏭  Built With
- [google/mediapipe](https://google.github.io/mediapipe/solutions/face_detection#javascript-solution-api "google/mediapipe")
- [jhabdas/fetch-inject](https://code.habd.as/jhabdas/fetch-inject "jhabdas/fetch-inject")

