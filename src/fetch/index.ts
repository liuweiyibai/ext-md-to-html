export function fetchApi(path: string, options: any) {
  console.log('====================================');
  console.log(import.meta.env);
  console.log('====================================');
  const urlPath = path.startsWith('/') ? path : `/${path}`;

  return fetch(`${urlPath}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
}

export async function putUserWorkFlows(data: any) {
  try {
    const response = await fetchApi('/trans-html-to-md', {
      method: 'post',
      body: data,
    });

    if (!response.ok) throw new Error(response.statusText);

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    return { error };
  }
}
