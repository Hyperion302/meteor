# Notes

On page load, 2 different things can happen. If the page was loaded by direct link, it's SSR. If it was done by a transition, it is prerendered on the client, thus no SSR occurs.

To handle auth:
If running on the server, return SEO data, in mounted() check auth

If running on client, do nothign and wait until mounted()

In both cases, mounted() should check auth and redirect if necessary.
