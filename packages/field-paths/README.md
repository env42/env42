# `@env42/field-paths`: Type-Safe Field Paths for life, the Universe and Everything

From `@env42/core` documentation:

  ```typescript
  export type AppConfig = {
    hostName: string;
    port: number;
    options: {
      autoStart: boolean;
    };
  };

  type AppConfigKeys = FieldPaths<AppConfig>;

  // Equivalent to
  type AppConfigKeys = 
    | 'hostName'
    | 'port'
    | 'options.autoStart';
  ```

> Notice how we can map deep paths using dot notation and still be type-safe by using `FieldPaths`. Kudos to `react-hook-forms` for the inspiration and for the permissive license that allows us to just copy the types over and not need to depend on the entire library. You can also import that type from here and use it for your own purposes. Perhaps down the line those types can be migrated into their own general purpose package. One can dream.

### DISCLAIMER: I'm not the true Author of this code!

> These types have been shamelessly copied from the execellent `react-hook-form` library. if you need this for anything unrelated to React, Hooks or Forms and it's not worthy to add the entire library as a dependency, this should be the scape hatch.
Yay OSS! =)

https://github.com/react-hook-form/react-hook-form/blob/master/LICENSE

https://github.com/react-hook-form/react-hook-form/blob/master/src/types/path/eager.ts
