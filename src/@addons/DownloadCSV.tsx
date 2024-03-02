export default function DownloadCSV(url: string, fileName: string = "bin_warden_reports.csv"){

    let headers = new Headers();
    headers.append('Jwt-Auth', 'Bearer MY-TOKEN');

    fetch(url,  {
      headers: {
        'jwt-auth': process.env.REACT_APP_JWT ?? "",
      }
    })
    .then(response => response.blob())
    .then(blobby => {

        let objectUrl = window.URL.createObjectURL(blobby);

        const link = document.createElement('a')
        link.href = objectUrl
        link.download = fileName;
        document.body.appendChild(link)
        link.click()
        link.remove()

        window.URL.revokeObjectURL(objectUrl);
    });
}