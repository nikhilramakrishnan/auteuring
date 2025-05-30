+++
draft = false
title = '5. live'
bookHidden = false
weight = 50
+++

# live

<style>
.live-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  margin: 2em 0;
}

.live-container iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 0;
}

.live-info {
  text-align: center;
  margin: 2em 0;
  color: #666;
}

@media (prefers-color-scheme: dark) {
  .live-info {
    color: #999;
  }
}
</style>

<div class="live-container">
  <iframe src="https://www.youtube.com/embed/live_stream?channel=UCYEDKvbtaaG8EZL-FcdVfqg" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
  </iframe>
</div>

<div class="live-info">
  live when streaming • offline otherwise
</div>