import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT;
async function main() {
    try {
        await prisma.$connect();
        console.log("server connected to database successfully!");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log("An unexpacted error has been occurred!", error);
    }
}
main();
