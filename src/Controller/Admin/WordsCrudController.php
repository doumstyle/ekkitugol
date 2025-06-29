<?php

namespace App\Controller\Admin;

use App\Entity\Words;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Form\Type\FileUploadType;

class WordsCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Words::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm()->hideOnIndex(),
            TextField::new('peul'),
            TextField::new('french'),
            TextField::new('audio')
                ->setFormType(FileUploadType::class)
                ->setCustomOption('basePath', 'audio/words')
                ->setFormTypeOptions(['upload_dir' => '/public/audio/words'])
                ->setCustomOption('uploadedFilenamePattern', '[randomhash].[extension]')
                ->setRequired(false),
        ];
    }
    
}
