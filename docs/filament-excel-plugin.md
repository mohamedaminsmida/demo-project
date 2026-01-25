# Filament Excel Plugin Notes

## Quickstart

Starting with v0.2 Filament Excel should work with both `filament/filament` and `filament/tables` packages. The most simple usage is just adding `ExportBulkAction` to your bulk actions.

**Example for admin package**

```php
<?php

namespace App\Filament\Resources;

use pxlrbt\FilamentExcel\Actions\Tables\ExportBulkAction;

class UserResource extends Resource
{
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                //
            ])
            ->bulkActions([
                ExportBulkAction::make()
            ]);
    }
}
```

**Example for separate table package**

```php
<?php

namespace App\Filament\Resources;

use pxlrbt\FilamentExcel\Actions\Tables\ExportBulkAction;

public function getTableBulkActions()
{
    return  [
        ExportBulkAction::make()
    ];
}
```

## Usage

Filament Excel comes with three actions you can use:

- `Actions\Tables\ExportBulkAction` for table bulk actions
- `Actions\Tables\ExportAction` for table header actions
- `Actions\Pages\ExportAction` for record pages

Without further configuration they will try to resolve the fields from the table or form definition and output an Excel file.

## Multiple export classes

You can overwrite the default export class and also configure multiple exports with different settings. The user will be shown a modal to select the export class they want to use.

```php
use pxlrbt\FilamentExcel\Actions\Tables\ExportAction;
use pxlrbt\FilamentExcel\Exports\ExcelExport;

ExportAction::make()->exports([
    ExcelExport::make('table')->fromTable(),
    ExcelExport::make('form')->fromForm(),
])
```

## Closure customization

Many of the functions for customising the export class accept a Closure that gets passed dynamic data:

```php
use pxlrbt\FilamentExcel\Actions\Tables\ExportAction;
use pxlrbt\FilamentExcel\Exports\ExcelExport;

ExportAction::make()->exports([
    ExcelExport::make('table')->withFilename(fn ($resource) => $resource::getLabel()),
])
```

The following arguments are available:

- `$livewire`: Livewire component (not available for queued exports)
- `$livewireClass`: Livewire component class
- `$resource`: Resource class
- `$model`: Model class
- `$recordIds`: IDs of selected records (Bulk Action)
- `$query`: The builder instance

## Filename

Set via `->withFilename()`:

```php
ExportAction::make()->exports([
    // Pass a string
    ExcelExport::make()->withFilename(date('Y-m-d') . ' - export'),

    // Or pass a Closure
    ExcelExport::make()->withFilename(fn ($resource) => $resource::getLabel())
])
```

## Export types

Set the file type via `->withWriterType()`:

```php
use Maatwebsite\Excel\Excel;

ExportAction::make()->exports([
    ExcelExport::make()->withWriterType(Excel::XLSX),
])
```

## Defining columns

When using `->fromForm()/->fromTable()/->fromModel()` the columns are resolved from your table or form definition. You can also provide columns manually, append columns or overwrite generated columns.

```php
use pxlrbt\FilamentExcel\Columns\Column;

ExportAction::make()->exports([
    ExcelExport::make()->withColumns([
        Column::make('name'),
        Column::make('created_at'),
        Column::make('deleted_at'),
    ]),
])
```

You can include only a subset (`->only()`) or exclude certain ones (`->except()`):

```php
ExportAction::make()->exports([
    ExcelExport::make()->fromTable()->except([
        'created_at', 'updated_at', 'deleted_at',
    ]),

    ExcelExport::make()->fromTable()->only([
        'id', 'name', 'title',
    ]),
])
```

When neither `->only()` nor `->except()` is passed the export will respect the `$hidden` attributes of your model (e.g. passwords). Disable this via `->except([])`.

## Headings

Headings resolve from your table/form definition. Overwrite them with `->withColumns()`:

```php
ExportAction::make()->exports([
    ExcelExport::make()->withColumns([
        Column::make('name')->heading('User name'),
        Column::make('email')->heading('Email address'),
        Column::make('created_at')->heading('Creation date'),
    ]),
])
```

Use `->withNamesAsHeadings()` to use column names or `->withoutHeadings()` to disable.

## Formatting

Each column can be formatted via a Closure. You also get access to `$state` and `$record`.

```php
ExportAction::make()->exports([
    ExcelExport::make()->withColumns([
        Column::make('email')
            ->formatStateUsing(fn ($state) => str_replace('@', '[at]', $state)),

        Column::make('name')
            ->formatStateUsing(fn ($record) => $record->locations->pluck('name')->join(',')),
    ]),
])
```

Columns auto-scale to content. Override via `->width(10)` or other numbers.

Use `PhpOffice\PhpSpreadsheet\Style\NumberFormat` constants for numeric formatting:

```php
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

ExportAction::make()->exports([
    ExcelExport::make()->withColumns([
        Column::make('currency')->format(NumberFormat::FORMAT_CURRENCY_EUR_INTEGER)
    ]),
])
```

## Ignore formatting

When using `->fromForm()/->fromTable()` the formatting is resolved from your table or form definition. Ignore formatting entirely or per column:

```php
use pxlrbt\FilamentExcel\Columns\Column;
use Illuminate\Support\Str;

ExportAction::make()->exports([
    // Ignore all formatting
    ExcelExport::make()->fromTable()->ignoreFormatting()

    // Ignore specific columns
    ExcelExport::make()->fromTable()->ignoreFormatting([
        'created_at', 'updated_at',
    ]),

    // Ignore columns based on Closure
    ExcelExport::make()->fromTable()->ignoreFormatting(
        fn (Column $column) => Str::startsWith($column->getName(), 'customer_')
    ),
])
```

## Formatters

Non-string column states are run through formatters even with `->ignoreFormatting()` (ArrayFormatter, EnumFormatter, ObjectFormatter). Swap implementations via the service container, e.g. different delimiter for ArrayFormatter:

```php
use pxlrbt\FilamentExcel\Exports\Formatters\ArrayFormatter;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        App::bind(ArrayFormatter::class, function () {
            return new ArrayFormatter(';');
        });
    }
}
```

## User input

Let the user pick filename/writer type:

```php
ExportAction::make()->exports([
    ExcelExport::make()
        ->askForFilename()
        ->askForWriterType()
])
```

You can reuse the user input inside a Closure:

```php
ExportAction::make()->exports([
    ExcelExport::make()
        ->askForFilename()
        ->withFilename(fn ($filename) => 'prefix-' . $filename)
])
```

## Modify the query

Modify the query used to retrieve the model via `->modifyQueryUsing()`:

```php
ExportAction::make()->exports([
    ExcelExport::make()
        ->fromTable()
        ->modifyQueryUsing(fn ($query) => $query->where('exportable', true))
])
```

## Queued exports

For large datasets use `->queue()` so exports run as background jobs; the user will be notified upon completion. Temporary files delete on first download, or after 24h via scheduler.

```php
ExportAction::make()->exports([
    ExcelExport::make()->queue()
])
```

Adjust chunk size via `->withChunkSize(100)`.

## Custom exports

Extend `ExcelExport` and configure via `setUp()`:

```php
use pxlrbt\FilamentExcel\Columns\Column;

class CustomExport extends ExcelExport
{
    public function setUp()
    {
        $this->withFilename('custom_export');
        $this->withColumns([
            Column::make('name'),
            Column::make('email'),
        ]);
    }
}
```

## Multiple sheets

Add additional custom sheets before/after the data sheet:

```php
ExportBulkAction::make()->exports([
    ExcelExport::make('user_export')->fromTable()
        ->withSheets(
            sheets: [
                new OverriddenDataSheet(),
            ],
            prepend: [
                new CoverSheet(),
            ],
            append: [
                new AppendixSheet(),
            ]
        )
])
```

Passing `sheets: array` overrides the default data sheet entirely.

## File download URL customization

Customize signed URLs if your WAF blocks default ones:

```php
use pxlrbt\FilamentExcel\FilamentExport;
use Illuminate\Support\Facades\URL;

FilamentExport::createExportUrlUsing(function ($export) {
    $fileInfo = pathinfo($export['filename']);
    $filenameWithoutExtension = $fileInfo['filename'];
    $extension = $fileInfo['extension'];

    return URL::temporarySignedRoute(
        'your-custom-route',
        now()->addHours(2),
        ['path' => $filenameWithoutExtension, 'extension' => $extension]
    );
});
```
