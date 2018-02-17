export const get = (url) =>
  fetch(url, { headers: { Accept: 'application/json' } })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Something went wrong while fetching episodes');
      }
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return response.json();
      }
      console.log(response);
    });
