<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class SaperController extends AbstractController
{
    /**
     * @Route("/game/saper", name="saper")
     */
    public function index()
    {
        return $this->render('saper/index.html.twig', [
            'controller_name' => 'SaperController',
        ]);
    }
}
