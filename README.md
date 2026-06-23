# DWOB Practice Library

Static, phone-friendly rhythm video library for `jordanschlak.com/dwob`.

## Cheapest hosting recommendation

Use a static host and keep the actual video files on YouTube, Vimeo, or another video platform. Do not host raw video files in this repo unless you want bandwidth, storage, transcoding, and mobile playback costs.

Good cheap options:

- GitHub Pages: free for public repositories, supports custom domains, and is enough for a simple static site.
- Cloudflare Pages: free tier includes Git integration, custom domains, unlimited static requests, and unlimited bandwidth.
- AWS CloudFront + S3: good if you want to keep it inside AWS. AWS currently advertises a $0/month CloudFront free plan with 5 GB included S3 storage, 1M requests, and 100 GB data transfer.

Kubernetes is not the cheapest production choice for this site. The included `Dockerfile` and `k8s/deployment.yaml` are useful for learning or for running this as a container, but static hosting is simpler and cheaper.

## Edit the video list

Update `videos.json`:

```json
{
  "title": "Warmup Groove",
  "description": "A short pocket-building loop for getting hands and feet moving.",
  "youtubeId": "YOUTUBE_VIDEO_ID",
  "level": "beginner",
  "tempo": "90 BPM",
  "duration": "3:33"
}
```

For a YouTube URL like:

```text
https://www.youtube.com/watch?v=abc123XYZ00
```

the `youtubeId` is:

```text
abc123XYZ00
```

## Run locally

Because the app fetches `videos.json`, serve it with a tiny web server:

```powershell
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Run with Docker

```powershell
docker build -t dwob-site .
docker run --rm -p 8080:80 dwob-site
```

## Deploy path

Recommended first deploy:

1. Put this folder in a GitHub repository.
2. Deploy it with Cloudflare Pages or GitHub Pages.
3. Point `jordanschlak.com` DNS at the host.
4. If you want the library at `/dwob`, either deploy the repository as a GitHub Pages project site or configure a redirect/rewrite at the host.
