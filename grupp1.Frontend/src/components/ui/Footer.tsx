export default function Footer() {

   // const developers: string[] = ["SunberryBlossom", "KiddN7", "Erik-Backdahl", "Janne022", "Gurrakeller", "Erkan334"]

    return (
        <footer className="flex flex-col fixed bottom-0 w-full p-2 text-center gap-1 text-muted-foreground">
            <hr className="mx-9" />
            <div className="flex flex-col">
                <div className="flex flex-col md:flex-row md:pl-8 gap-1 place-content-start ">
                    <div className="bg-card p-2 rounded-2xl w-auto  ">
                        <p>Interested in this project?</p>
                        <p>visit the repo <a className="text-accent" target="_blank" href="https://github.com/janne022/grupp1">here</a></p>
                    </div>
                    <div className="bg-card p-2 w-auto ">
                        <p>Created by N-G1N</p>
                        {/* <ul>
                    {developers.map(developer => <li>{developer}</li>)}
                    </ul> */}
                    </div>
                </div>
                <div className="bg-card p-2 rounded-2xl w-auto ">
                    <p>Copyright 2026: N-G1N development.</p>
                </div>
            </div>
        </footer>
    )
}