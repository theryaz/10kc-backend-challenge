# 10KC Backend Challenge

## Code Highlights

- The project was generated using the [Nx](https://nx.dev) monorepo tool
  - Shared Libraries `crypto`, `constants`, `errors`
- Controller/Service/Repository Layers with Dependency Injection provided by `typedi`
- Each "domain" has it's own directory with it's classes and Domain Transfer Objects (DTOs)
  - DTOs are used to expose the minimum information needed and avoid leaking sensitive data
  - DTOs also used for validation of user inputs with `class-validator`
- Authentication is handled by the `UserService` which passes password data to the `User` to set and verify passwords
  - Once authenticated, a JWT with `userId` and `username` is signed and returned.
  - Requests requiring auth use the `jwtAuth()` middleware factory
  - `jwtAuth()` returns a middleware function to authenticate this request. the `optional` param may be provided if auth isn't necessary (see getting photos by id)
- Secrets loaded through .env file with `dotenv` package
- Photos can only be uploaded by Authenticated users, and marked as private when uploaded
  - Accepted image mimetypes are defined in `@10kcbackend/constants`
    - image/png
    - image/jpeg
    - image/webp
  - Multiple photos may be uploaded at once
  - Uploads handled with `multer`. New photos are streamed directly into storage first, then the `Photo` domain object is created with reference once ready
  - Photos stored in MongoDB with [GridFS](https://www.mongodb.com/docs/manual/core/gridfs/) storage specification
    - Allows for files larger than 16MB
    - Would help to support animated images like image/gif or video

## Photo Endpoints 
- `POST /photo/upload` Uploads one or more photos for the requesting user (auth required)
  - Pass `private` query param to mark new photos as private
- `GET /photo/:userId` Returns a paginated response of all of a user's photos
  - Auth is not required, but if it is not provided you can only see public photos
  - If Auth is provided and you are looking at your own photos (userId matches JWT userId) then private photos will be included
  - Each photo returns a `PhotoReference` which includes URLs to load the image data
    - Full, Thumb, and Preview size image URLs provided for client (Only full is implemented :( )
    - `GET /photo/full/:photoId` returns the photo fullsize photo if it's not private, and requires auth + userId match to view private photos

- `GET /photo/comment/:photoId` returns a paginated list of comments for a given photoId (no auth required)
- `POST /photo/comment/:photoId/add` adds a comment to a photo for authenticated user's only
- `DELETE /photo/:photoId` deletes the photo by id
- `DELETE /photo/all` deletes all photos for the requesting user (just for convenience)



## Run the project

Dev Server:  
```
npx nx serve backend
```
Run backend tests:  
```
npx nx test backend
```
Test everything at once:  
```
npx nx run-many --target=test --all
```
